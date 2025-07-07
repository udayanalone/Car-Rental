import React from "react";
import { assets } from "../assets/assets";

const Banner = ({ onListCarClick = () => {} }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:m-auto rounded-3xl overflow-hidden">
      <div className="text-white">
        <h2 className="text-3xl font-medium">Do you own any Luxury car?</h2>
        <p className="mt-2">Monetize your car effortlessly using car rental.</p>
        <p className="max-w-130">
          We take care of insurance, driver verifications, and secure payments –
          so you can earn passive income, stress-free.
        </p>
        <button
          className="px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-am mt-4 cursor-pointer"
          onClick={onListCarClick}
        >
          List your car
        </button>
      </div>
      <img
        src={assets.banner_car_image}
        alt="Luxury car for rental banner"
        className="max-h-45 mt-10"
      />
    </div>
  );
};

export default Banner;
