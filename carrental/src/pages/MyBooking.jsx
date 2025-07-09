import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const MyBooking = () => {
  const { userBookings, fetchUserBookings, bookingLoading, currency, user } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user, fetchUserBookings]);

  if (bookingLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
        <Title
          title="My Bookings"
          subTitle="Please login to view your bookings"
          align="left"
        />
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You need to be logged in to view your bookings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
      <Title
        title="My Bookings"
        subTitle="View and manage all your car bookings"
        align="left"
      />

      {userBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No bookings found</p>
          <p className="text-gray-400 text-sm mt-2">Start by booking your first car!</p>
        </div>
      ) : (
        <div>
          {userBookings.map((booking, index) => (
            <div
              key={booking._id}
              className="flex flex-col md:flex-row items-center md:items-stretch gap-6 p-6 border border-gray-200 rounded-lg mt-5 first:mt-12 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Car Image + Info */}
              <div className="flex flex-col items-center md:items-start w-full md:w-64">
                <div className="rounded-md overflow-hidden mb-3 w-full">
                  <img
                    src={booking.car.image}
                    alt={`${booking.car.brand} ${booking.car.model}`}
                    className="w-full h-32 md:h-24 object-cover aspect-video"
                    onError={(e) => {
                      e.target.src = assets.car_image1;
                    }}
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
                  <span className="px-3 py-1.5 bg-gray-100 rounded text-sm">
                    Booking #{index + 1}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-1">
                  <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4" />
                  <span className="text-gray-500 text-sm">Rental Period</span>
                  <span className="font-medium text-sm text-gray-900">
                    {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
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
                  <span className="text-lg">💰</span>
                  Total Price
                </p>
                <h1 className="text-2xl font-semibold text-blue-600 leading-tight">
                  {currency}
                  {booking.totalPrice}
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                  Booked on {new Date(booking.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooking;
