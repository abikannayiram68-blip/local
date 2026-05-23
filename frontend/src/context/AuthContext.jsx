import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContextCore';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    try {
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      localStorage.removeItem('userInfo');
      return null;
    }
  });
  const loading = false;

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password, phone, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, role });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
