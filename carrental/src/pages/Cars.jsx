import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useAppContext } from "../context/AppContext";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

const Cars = () => {
  const { cars, axios, loading } = useAppContext();
  const [input, setInput] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const inSearchData = pickupDate && pickupLocation && returnDate;

  // Filter cars by input
  const applyFilter = () => {
    if (input === "") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) => {
        return (
          car.brand.toLowerCase().includes(input.toLowerCase()) ||
          car.model.toLowerCase().includes(input.toLowerCase()) ||
          car.transmission.toLowerCase().includes(input.toLowerCase()) ||
          car.fuel_type.toLowerCase().includes(input.toLowerCase()) ||
          car.category.toLowerCase().includes(input.toLowerCase())
        );
      });
      setFilteredCars(filtered);
    }
  };

  // Search car availability from backend
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });
      if (data.success) {
        setFilteredCars(data.avaliableCars || []);
        if ((data.avaliableCars || []).length === 0) {
          toast.error("No cars available for the selected dates");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (inSearchData) {
      searchCarAvailability();
    }
    // eslint-disable-next-line
  }, [pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (!inSearchData) {
      applyFilter();
    }
    // eslint-disable-next-line
  }, [input, cars]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="flex flex-col items-center py-20 bg-white max-md:px-4">
        <Title
          title="Available Cars"
          subTitle="Browse our collection of premium vehicles available for your next adventure"
        />
        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by model, feature"
            className="w-full h-full outline-none text-gray-500"
          />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5 ml-2" />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-600 mb-4">Showing {filteredCars.length} Cars</p>
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
            {filteredCars.map((car, index) => (
              <div key={car._id || index}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
