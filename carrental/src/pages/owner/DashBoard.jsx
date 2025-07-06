import React, { useEffect, useState } from "react";
import { dummyDashboardData, assets } from "../../assets/assets.js";
import Title from "../../components/owner/Title";

const DashBoard = () => {
  const currency = import.meta.env.VITE_CURRANCY;

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    {
      title: "Total Bookings",
      value: data.totalBookings,
      icon: assets.listIconColored,
    },
    {
      title: "Pending",
      value: data.pendingBookings,
      icon: assets.cautionIconColored,
    },
    {
      title: "Confirmed",
      value: data.completedBookings,
      icon: assets.listIconColored,
    },
  ];

  useEffect(() => {
    setData(dummyDashboardData);
  }, []);

  return (
    <div className="px-4 pt-10 md:px-10 flex-1 bg-[#fafbfc] min-h-screen">
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities"
      />

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor bg-white"
          >
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <p className="text-lg font-semibold">{card.value}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings & Monthly Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-4">
        {/* Recent Bookings */}
        <div className="col-span-2 bg-white border border-borderColor rounded-xl p-6">
          <h1 className="text-lg font-semibold mb-1">Recent Bookings</h1>
          <p className="text-gray-500 mb-4">Latest customer bookings</p>
          <div>
            {data.recentBookings.map((booking, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-3 px-2 rounded-lg ${
                  index !== data.recentBookings.length - 1 ? "mb-2" : ""
                } hover:bg-gray-50 transition`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <img
                      src={assets.listIconColored}
                      alt=""
                      className="h-5 w-5"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 leading-tight">
                      {booking.car.brand} {booking.car.model}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.createdAt.split("T")[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {currency}
                    {booking.price}
                  </span>
                  <span
                    className={`px-3 py-0.5 border border-borderColor rounded-full text-xs capitalize ${
                      booking.status === "confirmed"
                        ? "bg-white text-gray-800"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Monthly Revenue */}
        <div className="bg-white border border-borderColor rounded-xl p-6 flex flex-col justify-between">
          <h1 className="text-lg font-semibold mb-1">Monthly Revenue</h1>
          <p className="text-gray-500 mb-4">Revenue for current month</p>
          <p className="text-3xl font-semibold text-primary mt-6">
            {currency}
            {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
