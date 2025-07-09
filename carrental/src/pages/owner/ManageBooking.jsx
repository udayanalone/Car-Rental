import React, { useEffect } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";

const ManageBooking = () => {
  const { ownerBookings, fetchOwnerBookings, changeBookingStatus, currency, isOwner, bookingLoading } = useAppContext();

  useEffect(() => {
    if (isOwner) {
      fetchOwnerBookings();
    }
  }, [isOwner, fetchOwnerBookings]);

  const handleStatusChange = async (bookingId, status) => {
    await changeBookingStatus(bookingId, status);
  };

  if (bookingLoading) {
    return <Loader />;
  }

  if (!isOwner) {
    return (
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-gray-200 mt-6">
        <div className="px-4 pt-10 md:px-10 w-full">
          <Title
            title="Manage Bookings"
            subTitle="You need owner privileges to access this page"
          />
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Access denied</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full rounded-md overflow-hidden border border-gray-200 mt-6">
      <div className="px-4 pt-10 md:px-10 w-full">
        <Title
          title="Manage Bookings"
          subTitle="View all bookings, update their status or manage them from the booking platform"
        />
        
        {ownerBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">Bookings will appear here when customers make reservations</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Customer</th>
                <th className="p-3 font-medium max-md:hidden">Date Range</th>
                <th className="p-3 font-medium">Total</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ownerBookings.map((booking, index) => (
                <tr key={booking._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    {booking.car && booking.car.image ? (
                      <img
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        className="h-12 w-12 aspect-square rounded-md object-cover"
                        onError={(e) => {
                          e.target.src = assets.car_image1;
                        }}
                      />
                    ) : (
                      <span className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-md text-gray-400">
                        No Image
                      </span>
                    )}
                    <div>
                      <p className="font-medium">
                        {booking.car
                          ? `${booking.car.brand} ${booking.car.model}`
                          : "Unknown Car"}
                      </p>
                      <p className="text-xs text-gray-400 max-md:hidden">
                        {booking.car?.category} • {booking.car?.year}
                      </p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">
                    <div>
                      <p className="font-medium">{booking.user?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-400">{booking.user?.email}</p>
                    </div>
                  </td>
                  <td className="p-3 max-md:hidden">
                    <div>
                      <p className="text-sm">
                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-600">
                      {currency}{booking.totalPrice}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>

                  <td className="p-3">
                    {booking.status === "pending" ? (
                      <select
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        value={booking.status}
                        className="px-2 py-1.5 text-gray-500 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
