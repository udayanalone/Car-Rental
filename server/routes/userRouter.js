import express from "express";
import { registerUser, loginUser, getUserData, getUserCars } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { getCars } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data", protect, getUserData);
router.get("/cars", getCars);
// router.get("/cars", protect, getCars);

export default router;