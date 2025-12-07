import { Pool } from "pg";
import config from "./config";

//DB
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vehicle_rental_system",
  password: "alve",
  port: 5432,
});

const initDB = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
      );
    `);

    // Vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(255) UNIQUE NOT NULL,
        daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
      );
    `);

    // Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
        total_price NUMERIC NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
      );
    `);

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initDB;
