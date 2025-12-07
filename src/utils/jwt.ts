import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env");
}

export const jwtHelpers = {
  sign(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
  },

  verify<T = any>(token: string): T {
    return jwt.verify(token, JWT_SECRET) as T;
  },
};
