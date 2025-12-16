import React, { createContext, useContext } from 'react';

// Placeholder auth context for future implementation.
const AuthContext = createContext<Record<string, never>>({});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
