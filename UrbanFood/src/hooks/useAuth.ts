import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthToken,
  selectCurrentUser,
  selectIsLoggedIn,
} from '../features/auth/authSlice';
import {
  checkAuthStatus,
  loginUser,
  logoutUser,
  signupUser,
  toggleFavoriteDish,
  updateBiometricSetting,
} from '../features/auth/authThunks';
import { AppDispatch } from '../store';

// Auth state selector hook  no side effects.
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const checkAuth = () => {
    return dispatch(checkAuthStatus());
  };

  const login = (email: string, pin: string) => {
    return dispatch(loginUser({ email, pin }));
  };

  const signup = (userData: {
    name: string;
    email: string;
    phone: string;
    pin: string;
  }) => {
    return dispatch(signupUser(userData));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const toggleFavourite = (dishId: string) => {
    return dispatch(toggleFavoriteDish({ dishId }));
  };

  const updateBiometric = (enabled: boolean) => {
    return dispatch(updateBiometricSetting(enabled));
  };

  return {
    isLoggedIn,
    user,
    token,
    loading,
    error,
    checkAuth,
    login,
    signup,
    logout,
    toggleFavourite,
    updateBiometric,
  };
};
