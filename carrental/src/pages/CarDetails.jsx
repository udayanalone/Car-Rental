import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCar, fetchCarById, currency, loading, createBooking, bookingLoading, user } = useAppContext();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    pickupDate: '',
    returnDate: ''
  });
  const [errors, setErrors] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }
    if (!formData.returnDate) {
      newErrors.returnDate = 'Return date is required';
    }
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (pickup < today) {
        newErrors.pickupDate = 'Pickup date cannot be in the past';
      }
      if (returnDate <= pickup) {
        newErrors.returnDate = 'Return date must be after pickup date';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if user is logged in
    if (!user) {
      // Show login modal or redirect to login
      console.log('User not logged in');
      return;
    }

    // Create booking
    const bookingData = {
      car: car._id,
      pickupDate: formData.pickupDate,
      returnDate: formData.returnDate
    };

    const success = await createBooking(bookingData);
    if (success) {
      // Reset form
      setFormData({ pickupDate: '', returnDate: '' });
      setErrors({});
      setTotalPrice(0);
      setTotalDays(0);
      // Navigate to bookings page
      navigate('/my-bookings');
    }
  }, [formData, user, car, createBooking, navigate]);

  const handleDateChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  }, []);

  // Calculate total price and days when form data or car changes
  useEffect(() => {
    if (formData.pickupDate && formData.returnDate && car) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      
      if (returnDate > pickup) {
        const days = Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
        const price = days * car.pricePerDay;
        setTotalDays(days);
        setTotalPrice(price);
      } else {
        setTotalDays(0);
        setTotalPrice(0);
      }
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [formData.pickupDate, formData.returnDate, car]);

  // Load car data
  useEffect(() => {
    let isMounted = true;

    const loadCar = async () => {
      try {
        setIsLoading(true);
        if (selectedCar && selectedCar._id === id) {
          if (isMounted) {
            setCar(selectedCar);
          }
        } else {
          const carData = await fetchCarById(id);
          if (isMounted) {
            if (carData) {
              setCar(carData);
            } else {
              navigate('/cars');
            }
          }
        }
      } catch (error) {
        console.error('Error loading car:', error);
        if (isMounted) {
          navigate('/cars');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCar();

    return () => {
      isMounted = false;
    };
  }, [id, selectedCar, fetchCarById, navigate]);

  if (loading || isLoading || !car) {
    return <Loader />;
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-8 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
      >
        <img src={assets.arrow_icon} className="rotate-180 opacity-65" alt="Back" />
        Back to all cars
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image and Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <img 
              src={car.image} 
              className="w-full h-[400px] object-cover rounded-xl mb-6" 
              alt={`${car.brand} ${car.model}`}
              onError={(e) => {
                e.target.src = assets.car_image1;
              }}
            />
            <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
            <p className="text-gray-500 mb-4">{car.category} &bull; {car.year}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg" key={icon}>
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
          
          {totalDays > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Total Days:</span>
                <span className="font-semibold">{totalDays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Price:</span>
                <span className="text-lg font-bold text-blue-600">{currency}{totalPrice}</span>
              </div>
            </div>
          )}
          
          <hr className="border-gray-200" />
          
          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="text-gray-700">Pickup Date</label>
            <input
              type="date"
              className={`border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.pickupDate ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              id="pickup-date"
              value={formData.pickupDate}
              onChange={(e) => handleDateChange('pickupDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              placeholder="dd-mm-yyyy"
            />
            {errors.pickupDate && (
              <span className="text-red-500 text-sm">{errors.pickupDate}</span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="text-gray-700">Return Date</label>
            <input
              type="date"
              className={`border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.returnDate ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              id="return-date"
              value={formData.returnDate}
              onChange={(e) => handleDateChange('returnDate', e.target.value)}
              min={formData.pickupDate || new Date().toISOString().split('T')[0]}
              placeholder="dd-mm-yyyy"
            />
            {errors.returnDate && (
              <span className="text-red-500 text-sm">{errors.returnDate}</span>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={bookingLoading || !user || totalDays === 0}
            className={`w-full py-3 font-medium text-white rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
              bookingLoading || !user || totalDays === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {bookingLoading ? 'Creating Booking...' : !user ? 'Login to Book' : 'Book Now'}
          </button>
          
          <p className="text-center text-sm text-gray-400">No credit card required to reserve</p>
        </form>
      </div>
    </div>
  );
};

export default CarDetails;
