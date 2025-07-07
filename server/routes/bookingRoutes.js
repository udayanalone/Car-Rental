import express from "express";
import { checkCarAvailability, createBooking, getUserBookings, getOwnerBookings, changeBookingStatus } from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";



const bookingRouter=express.Router();

bookingRouter.post("/check-availability",checkCarAvailability);
bookingRouter.post("/create",protect,createBooking);
bookingRouter.get("/user",protect,getUserBookings);
bookingRouter.get("/owner",protect,getOwnerBookings);
bookingRouter.post("/change-status",protect,changeBookingStatus);

export default bookingRouter;