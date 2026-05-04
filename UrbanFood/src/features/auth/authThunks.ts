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
      console.log('❌ Login failed: Invalid credentials');
      return rejectWithValue('Invalid credentials');
    }

    const token = `token_${user.id}_${Date.now()}`;
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));

    console.log('✅ Login successful:', user.email);
    return { user, token };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return rejectWithValue(error?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  Omit<User, 'id'>,
  { rejectValue: string }
>('auth/signup', async (newUser, { rejectWithValue }) => {
  try {
    const users = await fetchUsersAPI();

    if (!users) {
      return rejectWithValue('Cannot fetch users. Check API connection.');
    }

    if (users.find((u) => u.email === newUser.email)) {
      console.log('❌ Signup failed: User already exists');
      return rejectWithValue('User already exists');
    }

    const createdUser: User = {
      ...newUser,
      id: `user_${Date.now()}`,
    };

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

    console.log('✅ Signup successful:', createdUser.email);
    return { user: createdUser, token };
  } catch (error: any) {
    console.error('❌ Signup error:', error);
    return rejectWithValue(error?.message || 'Signup failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
  console.log('✅ Logout successful');
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
      const user = JSON.parse(userStr);
      return { user, token };
    }
    return null;
  } catch (error) {
    return null;
  }
});
