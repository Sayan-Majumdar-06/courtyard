import { createContext, useState, useEffect } from 'react';
import {API} from '../api'

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await API.get(`/auth/me`, {
        credentials: "include",
      });

      const data = res.data;
        setUserData(data);
      } catch(err) {
        setUserData(null);
      } finally {
        setLoading(false)
      }
  };
  
  useEffect(() => {

    fetchUserData();
    window.addEventListener('popstate', fetchUserData);

    return () => removeEventListener('popstate', fetchUserData);
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}