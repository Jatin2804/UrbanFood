import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthToken,
  selectCurrentUser,
  selectIsLoggedIn,
} from '../features/auth/authSlice';
import { loginUser, logoutUser, signupUser } from '../features/auth/authThunks';
import { AppDispatch } from '../store';

// Auth state selector hook  no side effects.
// checkAuthStatus is called once at app startup in Splash.tsx.
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

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
