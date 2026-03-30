import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.token && !storedToken) {
        localStorage.setItem('token', parsedUser.token);
      }
      setUser(parsedUser);
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
