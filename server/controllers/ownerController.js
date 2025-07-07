import User from "../models/User.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import Cars from "../models/Cars.js";
import Booking from "../models/Booking.js";

export const protect = async (req, res, next) => {
  // Accept the token directly in the Authorization header (no Bearer required)
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided in Authorization header"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed",
      error: error.message
    });
  }
};
    
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you can list cars" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

//  list cars
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let cars;
        try {
            cars = JSON.parse(req.body.carData);
        } catch (e) {
            return res.json({ success: false, message: "Invalid carData JSON" });
        }

        const imageFile = req.file;
        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars"
        });

        const image = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        await Cars.create({
            ...cars,
            owner: _id,
            image
        });

        res.json({ success: true, message: "Car added successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Cars.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const {carId} = req.body.carId;
        const car = await Cars.findById(carId);

        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "You are not authorized to toggle availability of this car" });
        }
        car.isAvailable = !car.isAvailable;
        await car.save()
        res.json({ success: true, message: "Car availability toggled" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const {carId} = req.body.carId;
        const car = await Cars.findById(carId);

        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "You are not authorized to delete this car" });
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();
        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const { _id , role} = req.user;
        if(role !== "owner"){
            return res.json({ success: false, message: "You are not authorized to access this resource" });
        }
        const cars = await Cars.find({ owner: _id });
      const bookings=await Booking.find({owner:_id}).populate('car').sort({createdAt:-1});


      const pendingBookings=bookings.filter(booking=>booking.status==="pending");
      const confirmedBookings=bookings.filter(booking=>booking.status==="confirmed");


      const totalBookings=bookings.length;
      const totalRevenue=bookings.reduce((acc,booking)=>acc+booking.price,0);   

      const monthlyRevenue=bookings.slice().filter(booking=>booking.status==="confirmed").reduce((acc,booking)=>acc+booking.price,0);


      const monthlyBookings=bookings.slice().filter(booking=>booking.status==="confirmed").reduce((acc,booking)=>acc+1,0);

const dashboardData={
    totalCars:cars.length,
    totalBookings:bookings.length,
    pendingBookings:pendingBookings.length,
    confirmedBookings:confirmedBookings.length,
    recentBookings:bookings.slice(0,3),
    monthlyRevenue
}

        res.json({ success: true, dashboardData });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
