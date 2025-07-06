import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { assets, dummyCarData } from '../assets/assets';
import Loader from '../components/Loader';
const CarDetails = () => {

  const {id} =useParams()
  const naviagte=useNavigate();
  const [car,setCar]=useState(null);
  const currency=import.meta.env.VITE_CURRANCY;
  const handleSubmit=async (e)=>
  {
    e.preventDefault();
  }

  useEffect(()=>{
    setCar(dummyCarData.find(car=>car._id===id))
  },[id])

  return car ? (
  <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
    <button onClick={() => naviagte(-1)} className="flex items-center gap-2 mb-8 text-gray-500 cursor-pointer">
      <img src={assets.arrow_icon} className="rotate-180 opacity-65" alt="Back" />
      Back to all cars
    </button>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Image and Details */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <img src={car.image} className="w-full h-[400px] object-cover rounded-xl mb-6" alt={car.brand} />
          <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
          <p className="text-gray-500 mb-4">{car.category} &bull; {car.year}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map(({ icon, text }) => (
              <div className="flex flex-col items-center bg-light p-4 rounded-lg" key={icon}>
                <img src={icon} alt="icon" className="h-5 mb-2" />
                {text}
              </div>
            ))}
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Description</h2>
            <p className="text-gray-500">{car.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-medium mb-2">Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['360 Camera', 'Bluetooth', 'GPS', 'Heated Seats', 'Rear View Mirror'].map(item => (
                <li key={item} className="flex items-center text-gray-500">
                  <img src={assets.check_icon} alt="Check Icon" className="h-4 mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg h-max sticky top-24 rounded-2xl p-8 space-y-6 text-gray-500 flex flex-col justify-between min-w-[320px]">
        <div className="flex items-end justify-between">
          <span className="text-3xl text-gray-800 font-semibold">{currency}{car.pricePerDay}</span>
          <span className="text-base text-gray-400 font-normal mb-1">per day</span>
        </div>
        <hr className="border-borderColor" />
        <div className="flex flex-col gap-2">
          <label htmlFor="pickup-date" className="text-gray-700">Pickup Date</label>
          <input
            type="date"
            className="border border-borderColor px-3 py-2 rounded-lg"
            required
            id="pickup-date"
            min={new Date().toISOString().split('T')[0]}
            placeholder="dd-mm-yyyy"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="return-date" className="text-gray-700">Return Date</label>
          <input
            type="date"
            className="border border-borderColor px-3 py-2 rounded-lg"
            required
            id="return-date"
            min={new Date().toISOString().split('T')[0]}
            placeholder="dd-mm-yyyy"
          />
        </div>
        <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer">
          Book Now
        </button>
        <p className="text-center text-sm text-gray-400">No credit card required to reserve</p>
      </form>
    </div>
  </div>
) : <Loader />
}

export default CarDetails
