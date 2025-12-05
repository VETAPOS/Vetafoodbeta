import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  permissions: string[];
  user: null;
  loading: boolean;
  error?: string;
};

const AuthContext = createContext<AuthState>({ permissions: [], user: null, loading: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions] = useState<string[]>([]);
  const [user] = useState<null>(null);
  const [loading] = useState(false);
  const value = useMemo(() => ({ permissions, user, loading }), [permissions, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const hasPermission = (permissions: string[], code: string) => permissions.includes(code);
