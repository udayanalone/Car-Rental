import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

// Example of how to use context without props:
// const CarCardWithoutProps = () => {
//   const { selectedCar, selectCar } = useAppContext();
//   // Use selectedCar directly from context
// };

const CarCard = ({ car }) => {
  const { currency, selectCar } = useAppContext();

  if (!car) return null;

  const handleCardClick = () => {
    selectCar(car);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleImageError = (e) => {
    e.target.src = assets.car_image1; // Fallback image
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${car.brand} ${car.model}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <div className="relative">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        {car.isAvailable && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Available Now
          </span>
        )}
        <span className="absolute bottom-4 right-4 bg-black bg-opacity-90 text-white text-lg font-semibold px-3 py-1 rounded-lg shadow-md">
          {currency}
          {car.pricePerDay} <span className="text-sm font-normal">/ day</span>
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {car.brand} {car.model}
        </h3>
        <p className="text-gray-500 mb-4 text-sm">
          {car.category} &bull; {car.year}
        </p>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <img src={assets.users_icon} alt="Seats" className="w-5 h-5" />
            <span>{car.seating_capacity} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.fuel_icon} alt="Fuel" className="w-5 h-5" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.car_icon} alt="Transmission" className="w-5 h-5" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.location_icon} alt="Location" className="w-5 h-5" />
            <span className="truncate">{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
