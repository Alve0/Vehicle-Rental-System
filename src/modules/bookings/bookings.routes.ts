import express from "express";
import { auth } from "../../middlewares/auth.middleware";
import { bookingController } from "./bookings.controller";

const router = express.Router();

router.post("/", auth(["customer", "admin"]), bookingController.createBooking);

router.get("/", auth(["customer", "admin"]), bookingController.getBookings);

router.put(
  "/:bookingId",
  auth(["customer", "admin"]),
  bookingController.updateBooking
);

export const bookingRouter = router;
