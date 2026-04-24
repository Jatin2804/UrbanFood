import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dishesReducer from "../features/dishes/dishesSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  dishes: dishesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
