import { createContext, useState, useContext, useEffect } from "react";
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

  // Fetch user info
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/user/data');
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === 'owner');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user");
    }
  };

  // Fetch cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/user/cars');
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch cars");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsOwner(false);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  // On mount, set token and fetch cars
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    fetchCars();
  }, []);

  // When token changes, set axios header and fetch user
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate, currency, axios, user, setUser,
    token, setToken, isOwner, setIsOwner, fetchUser, showLogin,
    setShowLogin, logout, fetchCars, cars, setCars,
    pickupDate, setPickupDate, returnDate, setReturnDate
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
