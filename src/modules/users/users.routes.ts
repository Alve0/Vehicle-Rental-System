import express, { Request, Response } from "express";
import { userController } from "./users.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", auth(["admin"]), userController.getUser);

router.put("/:userId", auth(["admin", "customer"]), userController.updateUser);

export const userRoutes = router;
