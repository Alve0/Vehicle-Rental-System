import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env");
}

// Get expiry from env or default to "7d"
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as string;

const signOptions: SignOptions = {
  expiresIn: EXPIRES_IN as any,
};

export const jwtHelpers = {
  sign(payload: object): string {
    return jwt.sign(payload, JWT_SECRET as Secret, signOptions);
  },

  verify<T = any>(token: string): T {
    return jwt.verify(token, JWT_SECRET as Secret) as T;
  },
};
