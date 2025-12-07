import express, { Request, Response } from "express";
import { userController } from "./users.controller";

const router = express.Router();

router.get("/", userController.getUser);

export const userRoutes = router;
