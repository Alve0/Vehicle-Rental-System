import express from "express";
import { auth } from "../../middlewares/auth.middleware";
import { vehiclesController } from "./vehicles.controller";
const router = express.Router();

router.post("/", auth(["admin"]), vehiclesController.addVehicle);

router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehicle);

export const useVehiclesRouter = router;
