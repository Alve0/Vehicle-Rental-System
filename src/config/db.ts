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

const initDB = async () => {};

export default initDB;
