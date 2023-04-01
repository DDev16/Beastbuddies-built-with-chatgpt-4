// AppContext.js
import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const value = { pets, setPets, loading, setLoading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
