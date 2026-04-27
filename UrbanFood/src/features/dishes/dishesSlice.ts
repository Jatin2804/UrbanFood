import { createSlice } from '@reduxjs/toolkit';
import { fetchDishes, updateDishes } from './dishesThunk';
import { DishesState } from './dishesType';

const initialState: DishesState = {
  dishes: [],
  loading: false,
  error: null,
  updateLoading: false,
};

const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDishes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.dishes = action.payload;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(updateDishes.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateDishes.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateDishes.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export default dishesSlice.reducer;
