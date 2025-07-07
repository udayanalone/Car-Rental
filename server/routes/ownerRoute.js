import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, toggleCarAvailability, deleteCar, getDashboardData } from "../controllers/ownerController.js";
import { changeRoleToOwner } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";
const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"),protect, addCar);
ownerRouter.get("/toggle-car-availability", protect, toggleCarAvailability);
ownerRouter.get("/delete-car", protect, deleteCar);
ownerRouter.get("/dashboard", protect, getDashboardData);


export default ownerRouter;
