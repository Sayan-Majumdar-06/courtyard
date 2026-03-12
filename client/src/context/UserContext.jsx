import { createContext, useState, useEffect } from 'react';
import {API} from '../api'
import { useLocation } from 'react-router-dom'; // Add this at the top

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await API.get(`/auth/me`, {
          credentials: "include",
        });

        if(!res.ok) {
          setUserData(null);
          return;
        }

        const data = res.data;
        setUserData(data);
      } catch(err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [location.pathname]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}