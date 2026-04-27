import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDishesAPI,
  getDishesMeta,
  updateDishesAPI,
} from '../../services/apiService';
import { Dish } from './dishesType';

export const fetchDishes = createAsyncThunk<Dish[]>(
  'dishes/fetch',
  async () => {
    return await fetchDishesAPI();
  },
);

export const updateDishes = createAsyncThunk<any, Dish[]>(
  'dishes/update',
  async (updatedData) => {
    const meta = await getDishesMeta();
    return await updateDishesAPI(updatedData, meta.sha);
  },
);
