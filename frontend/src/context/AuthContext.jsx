import {createContext, useContext, useState, useEffect} from 'react';
import {getMe, logoutUser} from '../api/authAPI';

const AuthContext = createContext (null);

export function AuthProvider({children}) {
  const [user, setUser] = useState (null);
  const [loading, setLoading] = useState (true);
  useEffect (() => {
    const publicRoutes = ['/login', '/register', '/admin/login'];

    if (publicRoutes.includes (window.location.pathname)) {
      setLoading (false);
      return;
    }

    getMe ()
      .then (res => setUser (res.data.user))
      .catch (() => setUser (null))
      .finally (() => setLoading (false));
  }, []);

  const login = userData => setUser (userData);

  const logout = async () => {
    try {
      await logoutUser ();
    } catch (_) {}
    setUser (null);
  };

  return (
    <AuthContext.Provider value={{user, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth () {
  return useContext (AuthContext);
}
