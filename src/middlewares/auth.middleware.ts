// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { jwtHelpers } from "../utils/jwt";

export const auth = (roles?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization;
      if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token" });
      }

      const token = header.split(" ")[1];
      const decoded: any = jwtHelpers.verify(token as string);

      // attach to req (use as any or extend types)
      (req as any).user = decoded;

      if (roles && roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};
