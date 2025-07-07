import React, { useState, useEffect } from "react";
import { dummyCarData } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
const ManageCars = () => {

  const {axios,currency,isOwner}=useAppContext();

  const [cars, setCars] = useState([]);
  // const currency = import.meta.env.VITE_CURRENCY;
  const fetchOwnerCars = async () => {
    try{
      const {data}=await axios.get('/api/owner/cars');
      if(data.success){
        setCars(data.cars);
      }
      else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try{
      const {data}=await axios.post(`/api/owner/toggle-car/${carId}`);
      if(data.success){
        setCars(data.cars);
      }
      else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteCar = async (carId) => {
    try{
      const confirm=window.confirm("Are you sure you want to delete this car?");
      if(!confirm){
        return null;
      }
      const {data}=await axios.post(`/api/owner/delete-car/${carId}`);
      if(data.success){
        setCars(data.cars);
      }
      else{
        toast.error(data.message);
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  };


  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, []);

  return (
    <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
      <div className="px-4 pt-10 md:px-10 w-full">
        <Title
          title="Manages Cars"
          subTitle="View all listed cars , update their details or remove them form the booking platform"
        />
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
              <tr key={index} className="border-t border-borderColor">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={car.image}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover"
                  />
                  <div className="max-md:hidden">
                    <p className="font-medium">
                      {car.brand} {car.model}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden"> {car.category}</td>
                <td className="p-3">
                  {" "}
                  {currency}
                  {car.pricePerDay} /day
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      car.isAvailable
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {car.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="flex items-center p-3">
                  <img
                    src={
                      car.isAvailable ? assets.eye_close_icon : assets.eye_icon
                    }
                    alt=""
                    className="cursor-pointer"
                    onClick={()=>toggleAvailability(car._id)}
                  />
                  <img
                    src={assets.delete_icon}
                    alt=""
                    className="cursor-pointer"
                    onClick={()=>deleteCar(car._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;
