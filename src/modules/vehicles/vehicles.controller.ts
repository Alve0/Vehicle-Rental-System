import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.AddVehicale(req.body);
    res.status(200).json({
      success: true,
      message: "vihicle created successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      errMessage: err.message,
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.GetAllVehicles();
    res.status(200).json({
      success: true,
      message: "Got all the vehicles",
      data: result,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      errMessage: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const result = await vehiclesService.GetVehicle(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        errMessage: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Got the vehicle",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      errMessage: err.message,
    });
  }
};

export const vehiclesController = {
  addVehicle,
  getAllVehicles,
  getVehicle,
};
