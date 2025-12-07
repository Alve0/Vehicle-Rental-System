import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.CreateBooking(req.user!, req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create booking",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.GetBookings(req.user!);

    const message =
      req.user!.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to retrieve bookings",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;

    const result = await bookingService.UpdateBooking(
      req.user!,
      bookingId,
      status
    );

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update booking",
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
