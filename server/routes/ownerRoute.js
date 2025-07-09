import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, toggleCarAvailability, deleteCar, getDashboardData, getOwnerCars } from "../controllers/ownerController.js";
import { changeRoleToOwner } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car/:carId", protect, toggleCarAvailability);
ownerRouter.post("/delete-car/:carId", protect, deleteCar);
ownerRouter.get("/dashboard", protect, getDashboardData);

export default ownerRouter;
