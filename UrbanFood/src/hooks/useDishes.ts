import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDishes } from '../features/dishes/dishesThunk';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';

export const useDishes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dishes, loading, error } = useSelector(
    (state: RootState) => state.dishes,
  );

  // Auto-fetch dishes on first mount if not already loaded
  useEffect(() => {
    if (dishes.length === 0 && !loading && !error) {
      dispatch(fetchDishes());
    }
  }, []);

  const refresh = () => {
    dispatch(fetchDishes());
  };

  return {
    dishes,
    loading,
    error,
    refresh,
  };
};
