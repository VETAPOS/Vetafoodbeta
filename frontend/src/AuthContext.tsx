import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  permissions: string[];
};

const AuthContext = createContext<AuthState>({ permissions: [] });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions] = useState<string[]>(['settings.access']);
  const value = useMemo(() => ({ permissions }), [permissions]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const hasPermission = (permissions: string[], code: string) => permissions.includes(code);
