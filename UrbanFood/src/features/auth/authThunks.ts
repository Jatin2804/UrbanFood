import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsersAPI,
  getUsersMeta,
  updateUsersAPI,
} from '../../services/apiService';
import { User } from './authTypes';

const storage = {
  data: {} as Record<string, string>,
  async getItem(key: string): Promise<string | null> {
    return this.data[key] || null;
  },
  async setItem(key: string, value: string): Promise<void> {
    this.data[key] = value;
  },
  async removeItem(key: string): Promise<void> {
    delete this.data[key];
  },
};

let AsyncStorage: typeof storage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  AsyncStorage = storage;
}

const normalizeUser = (user: User): User => ({
  ...user,
  favoriteDishes: user.favoriteDishes ?? [],
});

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; pin: string },
  { rejectValue: string }
>('auth/login', async ({ email, pin }, { rejectWithValue }) => {
  try {
    const users = await fetchUsersAPI();

    if (!users || users.length === 0) {
      return rejectWithValue('No users found. Check API connection.');
    }

    const user = users.find((u) => u.email === email && u.pin === pin);

    if (!user) {
      console.log(' Login failed: Invalid credentials');
      return rejectWithValue('Invalid credentials');
    }

    const normalizedUser = normalizeUser(user);
    const token = `token_${user.id}_${Date.now()}`;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));

    console.log(' Login successful:', normalizedUser.email);
    return { user: normalizedUser, token };
  } catch (error: any) {
    console.error(' Login error:', error);
    return rejectWithValue(error?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  Omit<User, 'id' | 'favoriteDishes'> & { favoriteDishes?: string[] },
  { rejectValue: string }
>('auth/signup', async (newUser, { rejectWithValue }) => {
  try {
    const users = await fetchUsersAPI();

    if (!users) {
      return rejectWithValue('Cannot fetch users. Check API connection.');
    }

    if (users.find((u) => u.email === newUser.email)) {
      console.log(' Signup failed: User already exists');
      return rejectWithValue('User already exists');
    }

    const createdUser: User = normalizeUser({
      ...newUser,
      id: `user_${Date.now()}`,
    });

    const updatedUsers: User[] = [...users, createdUser];

    try {
      const meta = await getUsersMeta();
      await updateUsersAPI(updatedUsers, meta.sha);
    } catch (updateError) {
      // GitHub update failed
    }

    const token = `token_${createdUser.id}_${Date.now()}`;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(createdUser));

    console.log(' Signup successful:', createdUser.email);
    return { user: createdUser, token };
  } catch (error: any) {
    console.error(' Signup error:', error);
    return rejectWithValue(error?.message || 'Signup failed');
  }
});

export const updateBiometricSetting = createAsyncThunk<
  User,
  boolean,
  { rejectValue: string; state: any }
>('auth/updateBiometric', async (enabled, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const currentUser = state.auth.user;

    if (!currentUser) {
      return rejectWithValue('No user logged in');
    }

    const updatedUser = {
      ...currentUser,
      biometricEnabled: enabled,
    };

    // Save to AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

    console.log(' Biometric setting updated:', enabled);
    return updatedUser;
  } catch (error: any) {
    console.error(' Failed to update biometric setting:', error);
    return rejectWithValue(error?.message || 'Failed to update setting');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
  console.log(' Logout successful');
  return null;
});

export const checkAuthStatus = createAsyncThunk<{
  user: User;
  token: string;
} | null>('auth/checkStatus', async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    const userStr = await AsyncStorage.getItem('user');

    if (token && userStr) {
      const user = normalizeUser(JSON.parse(userStr));
      return { user, token };
    }
    return null;
  } catch (error) {
    return null;
  }
});

export const toggleFavoriteDish = createAsyncThunk<
  User,
  { dishId: string },
  { rejectValue: string; state: any }
>('auth/toggleFavoriteDish', async ({ dishId }, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const currentUser: User | null = state.auth.user;

    if (!currentUser) return rejectWithValue('No user logged in');

    const favorites = new Set((currentUser.favoriteDishes ?? []).filter(Boolean));
    if (favorites.has(dishId)) favorites.delete(dishId);
    else favorites.add(dishId);

    const updatedUser: User = {
      ...currentUser,
      favoriteDishes: Array.from(favorites),
    };

    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      const users = await fetchUsersAPI();
      const updatedUsers = users.map((u) =>
        u.id === updatedUser.id ? { ...u, favoriteDishes: updatedUser.favoriteDishes } : u,
      );
      const meta = await getUsersMeta();
      await updateUsersAPI(updatedUsers, meta.sha);
    } catch {
      // Best-effort remote update
    }

    return updatedUser;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to update favourites');
  }
});
