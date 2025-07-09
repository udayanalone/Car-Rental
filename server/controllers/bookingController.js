import Cars from "../models/Cars.js";
import Booking from "../models/Booking.js";
const isCarAvailable = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
        status: { $ne: 'cancelled' }
    });
    return bookings.length === 0;
};

export const checkCarAvailability = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;
        const cars = await Cars.find({ location, isAvailable: true });

        const avaliableCarsPromises = cars.map(async (car) => {
            const isAvailable = await isCarAvailable(car._id, pickupDate, returnDate);
            return {
                ...car._doc, isAvailable
            };
        });
        let avaliableCars = await Promise.all(avaliableCarsPromises);
        avaliableCars = avaliableCars.filter(car => car.isAvailable === true);
        res.json({ success: true, avaliableCars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const {_id} = req.user;
        const {car,pickupDate,returnDate} = req.body;

        // Validate required fields
        if (!car || !pickupDate || !returnDate) {
            return res.json({success: false, message: "Car, pickup date, and return date are required"});
        }

        // Validate dates
        const pickup = new Date(pickupDate);
        const returnDateObj = new Date(returnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (pickup < today) {
            return res.json({success: false, message: "Pickup date cannot be in the past"});
        }

        if (returnDateObj <= pickup) {
            return res.json({success: false, message: "Return date must be after pickup date"});
        }

        const isAvailable = await isCarAvailable(car,pickupDate,returnDate);

        if(!isAvailable){
            return res.json({success: false, message: "Car is not available for the selected dates"});
        }

        const carData = await Cars.findById(car);
        
        if (!carData) {
            return res.json({success: false, message: "Car not found"});
        }

        const noOfDays=Math.ceil((returnDateObj.getTime()-pickup.getTime())/(1000*60*60*24));
        const totalPrice=noOfDays*carData.pricePerDay;

        const booking = await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate: pickup,
            returnDate: returnDateObj,
            totalPrice
        });

        res.json({success: true, message: "Booking created successfully", booking});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user:_id}).populate("car").sort({createdAt:-1});
        res.json({success: true, bookings});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== "owner"){
            return res.json({success: false, message: "You are not authorized to access this resource"});
        }
        const {_id} = req.user;
        const bookings = await Booking.find({owner:_id}).populate("car user").select("-user.password").sort({createdAt:-1});
        res.json({success: true, bookings});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});     
    }
}

export const changeBookingStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId,status} = req.body;
        const booking = await Booking.findById(bookingId);

        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "You are not authorized to change the status of this booking"});
        }

        booking.status = status;
        await booking.save();

        res.json({success: true, message: "Booking status changed successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

