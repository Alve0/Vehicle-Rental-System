import { pool } from "../../config/db";

interface Payload {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: string;
}

const AddVehicle = async (payload: Payload) => {
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      payload.vehicle_name,
      payload.type,
      payload.registration_number,
      payload.daily_rent_price,
      payload.availability_status,
    ]
  );

  return result.rows[0];
};

const GetAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const GetVehicle = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (result.rows.length === 0) throw new Error("Vehicle not found");

  return result.rows[0];
};

const UpdateVehicle = async (id: number, payload: Payload) => {
  const fields = [];
  const values = [];

  let count = 1;

  for (const key in payload) {
    fields.push(`${key} = $${count}`);
    values.push((payload as any)[key]);
    count++;
  }

  if (fields.length === 0) throw new Error("No fields to update");

  values.push(id);

  const result = await pool.query(
    `UPDATE vehicles SET ${fields.join(", ")} WHERE id = $${count} RETURNING *`,
    values
  );

  return result.rows[0];
};

const DeleteVehicle = async (id: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

  if (result.rowCount === 0) throw new Error("Vehicle not found");

  return true;
};

export const vehiclesService = {
  AddVehicle,
  GetAllVehicles,
  GetVehicle,
  UpdateVehicle,
  DeleteVehicle,
};
