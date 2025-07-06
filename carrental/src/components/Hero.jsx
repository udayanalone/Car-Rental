import React, { useState } from "react";
import { assets, cityList } from "../../src/assets/assets";

const Hero = () => {
  const [pickupLocation, setpickUpLocation] = useState("");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-14 bg-light text-center">
      <h1 className="text-4xl md:text-5xl font-semibold">
        Luxury Cars on Rent
      </h1>
      <form className="w-full flex justify-center">
        <div className="bg-white rounded-full shadow-md flex items-center px-6 py-4 w-full max-w-4xl gap-6">
          <div className="flex flex-col items-start flex-1 min-w-[150px]">
            <label className="text-sm font-semibold mb-1">
              Pickup Location
            </label>
            <select
              required
              value={pickupLocation}
              onChange={(e) => setpickUpLocation(e.target.value)}
              className="bg-transparent outline-none text-base w-full"
            >
              <option value="">Please select location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start flex-1 min-w-[150px]">
            <label htmlFor="pickup-date" className="text-sm font-semibold mb-1">
              Pick-up Date
            </label>
            <input
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-base text-gray-500 w-full"
              required
              placeholder="dd-mm-yyyy"
            />
          </div>
          <div className="flex flex-col items-start flex-1 min-w-[150px]">
            <label htmlFor="return-date" className="text-sm font-semibold mb-1">
              Return Date
            </label>
            <input
              type="date"
              id="return-date"
              className="text-base text-gray-500 w-full"
              required
              placeholder="dd-mm-yyyy"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            <img src={assets.search_icon} alt="search" className="w-5 h-5" />
            Search
          </button>
        </div>
      </form>
      <img src={assets.main_car} alt="car" />
    </div>
  );
};

export default Hero;
