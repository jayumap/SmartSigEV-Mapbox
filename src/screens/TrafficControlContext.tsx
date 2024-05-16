// Create a new file to define the context
// TrafficControlContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the context
interface TrafficControlContextType {
  requestSent: boolean;
  setRequestSent: React.Dispatch<React.SetStateAction<boolean>>;
  requestStatus: string; // New state variable
  setRequestStatus: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const TrafficControlContext = createContext<TrafficControlContextType | undefined>(undefined);

// Create the provider component
export const TrafficControlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [requestSent, setRequestSent] = useState<boolean>(false);
    const [requestStatus, setRequestStatus] = useState<string>('requested');
  
    return (
      <TrafficControlContext.Provider value={{ requestSent, setRequestSent, requestStatus, setRequestStatus }}>
        {children}
      </TrafficControlContext.Provider>
    );
  };
// Custom hook to consume the context
export const useTrafficControl = (): TrafficControlContextType => {
  const context = useContext(TrafficControlContext);
  if (context === undefined) {
    throw new Error('useTrafficControl must be used within a TrafficControlProvider');
  }
  return context;
};
