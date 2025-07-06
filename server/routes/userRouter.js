import express from "express";
import { registerUser, loginUser, getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js"; // <-- Add this line

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/data", protect, getUserData);

export default router;