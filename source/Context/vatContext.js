import React, { createContext, useContext, useState } from 'react';

// Create a context
const VATContext = createContext();

// Create a context provider
export const VATProvider = ({ children }) => {
  const [addVAT, setAddVAT] = useState(false); 

  return (
    <VATContext.Provider value={{ addVAT, setAddVAT }}>
      {children}
    </VATContext.Provider>
  );
};

// Custom hook to consume the context
export const useVAT = () => useContext(VATContext);
