import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.AddVehicle(req.body);
    res.status(200).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
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
      message: "Got all vehicles",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      errMessage: err.message,
    });
  }
};

const getVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const result = await vehiclesService.GetVehicle(id);

    res.status(200).json({
      success: true,
      message: "Vehicle found",
      data: result,
    });
  } catch (err: any) {
    return res.status(404).json({
      success: false,
      errMessage: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    const result = await vehiclesService.UpdateVehicle(id, req.body);

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      errMessage: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.vehicleId);
    await vehiclesService.DeleteVehicle(id);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      errMessage: err.message,
    });
  }
};

export const vehiclesController = {
  addVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
