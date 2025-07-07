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

        const isAvailable = await isCarAvailable(car,pickupDate,returnDate);

        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"});
        }

        const carData = await Cars.findById(car);

        const picked=new Date(pickupDate);
        const returned=new Date(returnDate);
        const noOfDays=Math.ceil((returned.getTime()-picked.getTime())/(1000*60*60*24));
        const price=noOfDays*carData.pricePerDay;

        await Booking.create({car,owner:carData.owner,user:_id,pickupDate,returnDate,price});

        res.json({success: true, message: "Booking created successfully"});
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

