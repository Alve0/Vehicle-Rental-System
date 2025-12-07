import express, { Request, Response } from "express";
import { authControler } from "./auth.controller";
const router = express.Router();

router.post("/signup", authControler.createUser);

export const createUser = router;
