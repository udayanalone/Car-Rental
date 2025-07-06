import React from "react";
import Title from "./Title";
import { assets, dummyCarData } from "../assets/assets";
import CarCard from "./CarCard";
const FeatureSection = () => {
  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="Featured Vehicle"
        subTitle="Explore our section of premmium  vehicle for  your adventure."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18 ">
        {dummyCarData.slice(0, 6).map((car) => (
          <div key={car._id}>
            <CarCard car={car} />
          </div>
        ))}
      </div>

      <button onClick={()=>{navigate('/cars');scroll(0,0)}}
      className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 round-md mt-18 cursor-pointer  ">
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </button>
    </div>
  );
};

export default FeatureSection;
