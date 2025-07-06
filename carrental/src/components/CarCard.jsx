import React from "react";
import { assets } from "../assets/assets";
import { Navigate, useNavigate } from "react-router-dom";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRANCY || "$";
  const naviagte=useNavigate();

  return (
    <div  onClick={()=>{naviagte(`/car-details/${car._id}`);scrollTo(0,0)}}
    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
      <div className="relative">
        <img src={car.image} alt="car" className="w-full h-48 object-cover" />
        {car.isAvaliable && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
            Available Now
          </span>
        )}
        <span className="absolute bottom-4 right-4 bg-black bg-opacity-90 text-white text-lg font-semibold px-4 py-1 rounded-lg">
          {currency}
          {car.pricePerDay}{" "}
          <span className="text-sm font-normal">/ day</span>
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-500 mb-4">
          {car.category} &bull; {car.year}
        </p>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <img src={assets.users_icon} alt="Seats" className="w-5 h-5" />
            {car.seating_capacity} Seats
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.fuel_icon} alt="Fuel" className="w-5 h-5" />
            {car.fuel_type}
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.car_icon} alt="Transmission" className="w-5 h-5" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.location_icon} alt="Location" className="w-5 h-5" />
            {car.location}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
