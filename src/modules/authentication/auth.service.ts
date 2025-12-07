// src/modules/authentication/auth.service.ts
import { pool } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/bycript";
import { jwtHelpers } from "../../utils/jwt";

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

const createUser = async (payload: CreateUserPayload) => {
  const { name, email, password, phone, role } = payload;
  console.log(email);
  // Check if already exists
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  console.log(existing);
  if (existing.rowCount != 0) {
    throw new Error("Email already registered");
  }

  const hashed = await hashPassword(password);
  console.log(hashed);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email,role, phone`,
    [name, email, hashed, role, phone]
  );

  return result.rows[0];
};

const signin = async (payload: LoginPayload) => {
  const { email, password } = payload;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rowCount === 0) throw new Error("Invalid credentials");

  const user = result.rows[0];

  const match = await comparePassword(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = await jwtHelpers.sign({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  console.log(token);

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    created_at: user.created_at,
  };

  return { token, user: safeUser };
};

export const authService = {
  createUser,
  signin,
};
