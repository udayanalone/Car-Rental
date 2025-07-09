import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch user info
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch user");
    }
  }, [navigate]);

  // Fetch cars
  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/cars');
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single car by ID
  const fetchCarById = useCallback(async (carId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user/cars/${carId}`);
      if (data.success) {
        setSelectedCar(data.car);
        return data.car;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch car details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create booking
  const createBooking = useCallback(async (bookingData) => {
    try {
      setBookingLoading(true);
      const { data } = await axios.post('/api/bookings/create', bookingData);
      if (data.success) {
        toast.success('Booking created successfully!');
        // Refresh user bookings
        fetchUserBookings();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error?.response?.data?.message || "Failed to create booking");
      return false;
    } finally {
      setBookingLoading(false);
    }
  }, []);

  // Fetch user bookings
  const fetchUserBookings = useCallback(async () => {
    try {
      setBookingLoading(true);
      const { data } = await axios.get('/api/bookings/user');
      if (data.success) {
        setUserBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setBookingLoading(false);
    }
  }, []);

  // Fetch owner bookings
  const fetchOwnerBookings = useCallback(async () => {
    try {
      setBookingLoading(true);
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
        setOwnerBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch owner bookings");
    } finally {
      setBookingLoading(false);
    }
  }, []);

  // Change booking status (for owners)
  const changeBookingStatus = useCallback(async (bookingId, status) => {
    try {
      setBookingLoading(true);
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status
      });
      if (data.success) {
        toast.success('Booking status updated successfully!');
        // Refresh owner bookings
        fetchOwnerBookings();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error('Error changing booking status:', error);
      toast.error(error?.response?.data?.message || "Failed to update booking status");
      return false;
    } finally {
      setBookingLoading(false);
    }
  }, [fetchOwnerBookings]);

  // Check car availability
  const checkCarAvailability = useCallback(async (location, pickupDate, returnDate) => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location,
        pickupDate,
        returnDate
      });
      if (data.success) {
        return data.avaliableCars || [];
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error(error?.response?.data?.message || "Failed to check availability");
      return [];
    }
  }, []);

  // Select car and navigate to details
  const selectCar = useCallback((car) => {
    setSelectedCar(car);
    navigate(`/car-details/${car._id}`);
    window.scrollTo(0, 0);
  }, [navigate]);

  // Clear selected car
  const clearSelectedCar = useCallback(() => {
    setSelectedCar(null);
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsOwner(false);
    setToken(null);
    setSelectedCar(null);
    setUserBookings([]);
    setOwnerBookings([]);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  }, []);

  // On mount, set token and fetch cars
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    fetchCars();
  }, [fetchCars]);

  // When token changes, set axios header and fetch user
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token, fetchUser]);

  // Fetch owner cars
  const fetchOwnerCars = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) {
        setCars(data.cars);
        return data.cars;
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching owner cars:', error);
      toast.error(error?.response?.data?.message || "Failed to fetch owner cars");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle car availability
  const toggleCarAvailability = useCallback(async (carId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/owner/toggle-car/${carId}`);
      if (data.success) {
        setCars(data.cars);
        toast.success('Car availability updated successfully!');
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error('Error toggling car availability:', error);
      toast.error(error?.response?.data?.message || "Failed to update car availability");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete car
  const deleteCar = useCallback(async (carId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/owner/delete-car/${carId}`);
      if (data.success) {
        setCars(data.cars);
        toast.success('Car deleted successfully!');
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error(error?.response?.data?.message || "Failed to delete car");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    navigate, currency, axios, user, setUser,
    token, setToken, isOwner, setIsOwner, fetchUser, showLogin,
    setShowLogin, logout, fetchCars, cars, setCars,
    pickupDate, setPickupDate, returnDate, setReturnDate,
    selectedCar, setSelectedCar, selectCar, clearSelectedCar,
    fetchCarById, loading, createBooking, fetchUserBookings,
    fetchOwnerBookings, changeBookingStatus, checkCarAvailability,
    userBookings, ownerBookings, bookingLoading,
    fetchOwnerCars, toggleCarAvailability, deleteCar
  }), [
    navigate, currency, user, token, isOwner, showLogin, cars,
    pickupDate, returnDate, selectedCar, loading, userBookings,
    ownerBookings, bookingLoading, fetchUser, fetchCars, fetchCarById,
    createBooking, fetchUserBookings, fetchOwnerBookings,
    changeBookingStatus, checkCarAvailability, selectCar,
    clearSelectedCar, logout, setUser, setToken, setIsOwner,
    setShowLogin, setCars, setPickupDate, setReturnDate,
    setSelectedCar, fetchOwnerCars, toggleCarAvailability, deleteCar
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
