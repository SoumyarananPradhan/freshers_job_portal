import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state synchronously! 
  // This prevents the "null flash" on page refresh.
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem('username');
    const is_student = localStorage.getItem('is_student') === 'true';
    const is_recruiter = localStorage.getItem('is_recruiter') === 'true';
    return username ? { username, is_student, is_recruiter } : null;
  });

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_student');
    localStorage.removeItem('is_recruiter');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};