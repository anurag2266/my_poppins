import React, { createContext, useState } from 'react';

// Create the context
export const AddressContext = createContext();

// Create the context provider
export const AddressProvider = ({ children }) => {
  const [fulladdress, setfullAddress] = useState('');

  return (
    <AddressContext.Provider value={{ fulladdress, setfullAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
