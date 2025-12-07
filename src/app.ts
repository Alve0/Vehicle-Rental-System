import express, { Request, Response } from "express";

import initDB from "./config/db";
import { userRoutes } from "./modules/users/users.routes";
import { authRoutes } from "./modules/authentication/auth.routes";
import { useVehiclesRouter } from "./modules/vehicles/vehicles.routes";

const app = express();

app.use(express.json());

initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

app.use("/api/v1/auth/", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/vehicles", useVehiclesRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
