import React, { useEffect } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";

const ManageCars = () => {
  const { 
    cars, 
    currency, 
    isOwner, 
    loading, 
    fetchOwnerCars, 
    toggleCarAvailability, 
    deleteCar 
  } = useAppContext();

  useEffect(() => {
    if (isOwner) {
      fetchOwnerCars();
    }
  }, [isOwner, fetchOwnerCars]);

  const handleToggleAvailability = async (carId) => {
    await toggleCarAvailability(carId);
  };

  const handleDeleteCar = async (carId) => {
    const confirm = window.confirm("Are you sure you want to delete this car?");
    if (confirm) {
      await deleteCar(carId);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!isOwner) {
    return (
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-gray-200 mt-6">
        <div className="px-4 pt-10 md:px-10 w-full">
          <Title
            title="Manage Cars"
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
          title="Manage Cars"
          subTitle="View all listed cars, update their details or remove them from the booking platform"
        />
        
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found</p>
            <p className="text-gray-400 text-sm mt-2">Add your first car to start renting</p>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500">
              <tr>
                <th className="p-3 font-medium">Car</th>
                <th className="p-3 font-medium max-md:hidden">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium max-md:hidden">Status</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={car._id || index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                      onError={(e) => {
                        e.target.src = assets.car_image1;
                      }}
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-xs text-gray-400">{car.year}</p>
                    </div>
                  </td>

                  <td className="p-3 max-md:hidden">{car.category}</td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-600">
                      {currency}{car.pricePerDay}
                    </span>
                    <span className="text-gray-400 text-xs"> /day</span>
                  </td>

                  <td className="p-3 max-md:hidden">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        car.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleAvailability(car._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={car.isAvailable ? "Make Unavailable" : "Make Available"}
                      >
                        <img
                          src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                          alt={car.isAvailable ? "Make Unavailable" : "Make Available"}
                          className="w-5 h-5"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Car"
                      >
                        <img
                          src={assets.delete_icon}
                          alt="Delete"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
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

export default ManageCars;
