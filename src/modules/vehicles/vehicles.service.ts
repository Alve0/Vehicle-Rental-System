import { Request, Response } from "express";
import { pool } from "../../config/db";

interface Payload {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

const AddVehicale = async (payload: Payload) => {
  try {
    const result = await pool.query(
      `INSERT INTO vehicles (vehicle_name, type, registration_number,daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, vehicle_name, type, registration_number,daily_rent_price, availability_status`,
      [
        payload.vehicle_name,
        payload.type,
        payload.registration_number,
        payload.daily_rent_price,
        payload.availability_status,
      ]
    );

    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const GetAllVehicles = async () => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);

    return result.rows;
  } catch (err: any) {
    throw err;
  }
};

export const vehiclesService = {
  AddVehicale,
  GetAllVehicles,
};
