import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const { axios } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  // Fetch bookings from backend
  const fetchMyBooking = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchMyBooking();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      <div>
        {bookings.map((booking, index) => (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row items-center md:items-stretch gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12 bg-white"
          >
            {/* Car Image + Info */}
            <div className="flex flex-col items-center md:items-start w-full md:w-64">
              <div className="rounded-md overflow-hidden mb-3 w-full">
                <img
                  src={booking.car.image}
                  alt=""
                  className="w-full h-32 md:h-24 object-cover aspect-video"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {booking.car.brand} {booking.car.model}
                </h3>
                <p className="text-gray-500 text-sm">
                  {booking.car.year} &bull; {booking.car.category} &bull; {booking.car.location}
                </p>
              </div>
            </div>

            {/* Booking Info */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1.5 bg-light rounded text-sm">
                  Booking #{index + 1}
                </span>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : ""
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-1">
                <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4" />
                <span className="text-gray-500 text-sm">Rental Period</span>
                <span className="font-medium text-sm text-gray-900">
                  {booking.pickupDate.split("T")[0]} To {booking.returnDate.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img src={assets.location_icon_colored} alt="" className="w-4 h-4" />
                <span className="text-gray-500 text-sm">Pick-up Location</span>
                <span className="font-medium text-sm text-gray-900">{booking.car.location}</span>
              </div>
            </div>

            {/* Price Info */}
            <div className="flex flex-col items-end justify-between min-w-[120px]">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <img src={assets.price_icon} alt="" className="w-4 h-4" />
                Total Price
              </p>
              <h1 className="text-2xl font-semibold text-primary leading-tight">
                {currency}
                {booking.price}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Booked on {booking.createdAt.split("T")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;
