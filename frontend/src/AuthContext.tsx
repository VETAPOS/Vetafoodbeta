import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchSession, UserDto } from './api';

type AuthState = {
  permissions: string[];
  user: UserDto | null;
  loading: boolean;
  error?: string;
};

const AuthContext = createContext<AuthState>({ permissions: [], user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    fetchSession()
      .then((session) => {
        setUser(session);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const permissions = user?.effectivePermissions || [];
  const value = useMemo(() => ({ permissions, user, loading, error }), [permissions, user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export const hasPermission = (permissions: string[], code: string) => permissions.includes(code);
