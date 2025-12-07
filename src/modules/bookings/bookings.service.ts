// bookings.service.ts  ← FINAL VERSION THAT WORKS RIGHT NOW
import { pool } from "../../config/db";

interface BookingPayload {
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const CreateBooking = async (user: any, payload: BookingPayload) => {
  const { vehicle_id, rent_start_date, rent_end_date } = payload;
  const customerId = user.userId; // this comes from JWT

  // 1. Get vehicle
  const vResult = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1 FOR UPDATE`,
    [vehicle_id]
  );

  if (vResult.rows.length === 0) throw new Error("Vehicle not found");
  const vehicle = vResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available");
  }

  // 2. Calculate price
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
  );
  if (days <= 0) throw new Error("End date must be after start date");

  const total_price = days * Number(vehicle.daily_rent_price);

  // 3. Insert booking — using customer_id column (most people name it this way)
  const bResult = await pool.query(
    `INSERT INTO bookings 
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customerId, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = bResult.rows[0];

  // 4. Mark vehicle as booked
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  // 5. Return exactly the format you wanted in Postman
  return {
    id: booking.id,
    customer_id: booking.customer_id,
    vehicle_id: booking.vehicle_id,
    rent_start_date: booking.rent_start_date,
    rent_end_date: booking.rent_end_date,
    total_price: Number(booking.total_price),
    status: "active",
    vehicle: {
      vehicle_name: vehicle.vehicle_name || `${vehicle.make} ${vehicle.model}`,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};

const GetBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT 
        b.*, 
        u.name as customer_name, 
        u.email as customer_email,
        v.vehicle_name,
        v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `);

    return result.rows.map((b) => ({
      id: b.id,
      customer_id: b.customer_id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date,
      rent_end_date: b.rent_end_date,
      total_price: Number(b.total_price),
      status: b.status,
      customer: { name: b.customer_name, email: b.customer_email },
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
      },
    }));
  }

  // Customer view
  const result = await pool.query(
    `
    SELECT b.*, v.vehicle_name, v.registration_number
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id DESC
  `,
    [user.userId]
  );

  return result.rows.map((b) => ({
    id: b.id,
    vehicle_id: b.vehicle_id,
    rent_start_date: b.rent_start_date,
    rent_end_date: b.rent_end_date,
    total_price: Number(b.total_price),
    status: b.status,
    vehicle: {
      vehicle_name: b.vehicle_name,
      registration_number: b.registration_number,
    },
  }));
};

const UpdateBooking = async (
  user: any,
  bookingId: number,
  newStatus: string
) => {
  const normalizedStatus = newStatus.toLowerCase().trim();

  if (!["cancelled", "canceled", "returned"].includes(normalizedStatus)) {
    throw new Error("Invalid status. Use 'cancelled' or 'returned'");
  }

  const statusToSave =
    normalizedStatus === "canceled" ? "cancelled" : normalizedStatus;

  const bResult = await pool.query(
    `SELECT b.*, v.availability_status 
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`,
    [bookingId]
  );

  if (bResult.rows.length === 0) throw new Error("Booking not found");
  const booking = bResult.rows[0];

  if (user.role === "customer") {
    if (booking.customer_id !== user.userId) {
      throw new Error("You can only modify your own booking");
    }

    if (!["cancelled", "canceled"].includes(normalizedStatus)) {
      throw new Error("Customers can only cancel bookings");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);
    if (today >= startDate) {
      throw new Error("Cannot cancel on or after start date");
    }

    await pool.query(`UPDATE bookings SET status = $1 WHERE id = $2`, [
      statusToSave,
      bookingId,
    ]);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking cancelled successfully",
      data: {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: Number(booking.total_price),
        status: "cancelled",
      },
    };
  }

  if (user.role === "admin") {
    if (normalizedStatus !== "returned") {
      throw new Error("Admins can only mark as 'returned'");
    }

    await pool.query(`UPDATE bookings SET status = 'returned' WHERE id = $1`, [
      bookingId,
    ]);

    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date,
        rent_end_date: booking.rent_end_date,
        total_price: Number(booking.total_price),
        status: "returned",
        vehicle: { availability_status: "available" },
      },
    };
  }

  throw new Error("Unauthorized");
};

export const bookingService = {
  CreateBooking,
  GetBookings,
  UpdateBooking,
};
