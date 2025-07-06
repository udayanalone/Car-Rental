import React, { useEffect, useState } from "react";
import { assets, dummyMyBookingsData } from "../../assets/assets";
import Title from "../../components/owner/Title";
const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);

  const currency = import.meta.env.VITE_CURRANCY;

  const fetchOwner = async () => {
    setBookings(dummyMyBookingsData);
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
      <div className="px-4 pt-10 md:px-10 w-full">
        <Title
          title="Manages Bookings"
          subTitle="View all listed cars , update their details or remove them form the booking platform"
        />
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment Option</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  {booking.car && booking.car.image ? (
                    <img
                      src={booking.car.image}
                      alt=""
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                  ) : (
                    <span className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-md text-gray-400">
                      No Image
                    </span>
                  )}
                  <p className="font-medium max-md:hidden">
                    {booking.car
                      ? `${booking.car.brand} ${booking.car.model}`
                      : "Unknown Car"}
                  </p>
                </td>
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate?.split("T")[0]} to{" "}
                  {booking.returnDate?.split("T")[0]}
                </td>
                <td className="p-3">
                  {currency}
                  {booking.price}
                </td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    offline
                  </span>
                </td>

                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select
                      value={booking.status}
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooking;
