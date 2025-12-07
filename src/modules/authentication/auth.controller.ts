import { Request, Response } from "express";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await authService.createUser({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created",
      data: user,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const result = await authService.signin({ email, password });

    res.status(200).json({
      success: true,
      token: result.token,
      user: result.user,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const authController = {
  signup,
  signin,
};
