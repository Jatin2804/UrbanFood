import { User } from '../features/auth/authTypes';
import { Dish } from '../features/dishes/dishesType';
import { encodeBase64 } from '../utils/ base64';
import { githubApi, rawApi } from './apiClient';

export const fetchDishesAPI = async (): Promise<Dish[]> => {
  try {
    const res = await rawApi.get('/dishes.json');
    let data = res.data;
    if (typeof data === 'string') data = JSON.parse(data);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.dishes)) return data.dishes;
    return [];
  } catch {
    return [];
  }
};

export const getDishesMeta = async () => {
  const res = await githubApi.get('/dishes.json');
  return res.data;
};

export const updateDishesAPI = async (updatedData: Dish[], sha: string) => {
  const content = encodeBase64(updatedData);
  const res = await githubApi.put('/dishes.json', {
    message: 'Update dishes',
    content,
    sha,
  });
  return res.data;
};

export const getDishById = (dishes: Dish[], id: string): Dish | undefined =>
  dishes.find((d) => d.id === id);

export const fetchUsersAPI = async (): Promise<User[]> => {
  try {
    const res = await rawApi.get('/users.json');
    let data = res.data;
    if (typeof data === 'string') {
      if (data.trim().startsWith('"users":')) data = '{' + data + '}';
      data = JSON.parse(data);
    }
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.users)) return data.users;
    return [];
  } catch {
    return [];
  }
};

export const getUsersMeta = async () => {
  const res = await githubApi.get('/users.json');
  return res.data;
};

export const updateUsersAPI = async (updatedUsers: User[], sha: string) => {
  const content = encodeBase64(updatedUsers);
  const res = await githubApi.put('/users.json', {
    message: 'Update users',
    content,
    sha,
  });
  return res.data;
};

export const getUserById = (users: User[], id: string): User | undefined =>
  users.find((u) => u.id === id);

export const fetchCartsAPI = async (): Promise<any> => {
  try {
    const res = await rawApi.get('/carts.json');
    return res.data;
  } catch {
    return [];
  }
};

export const getCartsMeta = async () => {
  try {
    const res = await githubApi.get('/carts.json');
    return res.data;
  } catch {
    return null;
  }
};

export const updateCartsAPI = async (carts: any[], sha: string) => {
  const content = encodeBase64({ carts });
  const res = await githubApi.put('/carts.json', {
    message: 'Update carts',
    content,
    sha,
  });
  return res.data;
};

export const createCartsFileAPI = async (carts: any[]) => {
  const content = encodeBase64({ carts });
  const res = await githubApi.put('/carts.json', {
    message: 'Create carts',
    content,
  });
  return res.data;
};
