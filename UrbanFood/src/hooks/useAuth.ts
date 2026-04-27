import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAuthError,
    selectAuthLoading,
    selectAuthToken,
    selectCurrentUser,
    selectIsLoggedIn,
} from '../features/auth/authSlice';
import { checkAuthStatus, loginUser, logoutUser, signupUser } from '../features/auth/authThunks';
import { AppDispatch } from '../store';

export const useAuth = () => { 
  const dispatch = useDispatch<AppDispatch>();
  
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const login = async (email: string, pin: string) => {
    return dispatch(loginUser({ email, pin }));
  };

  const signup = async (userData: { name: string; email: string; phone: string; pin: string }) => {
    return dispatch(signupUser(userData));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  return {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
  };
};
