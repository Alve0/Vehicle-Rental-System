import { Request, Response } from "express";
import { userServices } from "./users.service";
import { auth } from "../../middlewares/auth.middleware";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const user = await req.user;
  const id: number = Number(req.params.userId);
  try {
    if (user?.role != "admin" && user?.userId != id) {
      return res.status(404).json({
        success: false,
        message: "NOT ENOUGH POWER",
        details:
          "You have to be admin to change others details you can only change your own",
      });
    }
    if (user?.role === "admin") {
      const result = await userServices.AdminUpdateUser(id, req.body);
    }

    const result = await userServices.CustomerUpdateUser(id, req.body);

    return res.status(200).json({
      success: true,
      message: "updated user successfully",
      details: "users have been updated",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      datails: "from UserController to update user",
    });
  }
};

export const userController = {
  getUser,
  updateUser,
};
