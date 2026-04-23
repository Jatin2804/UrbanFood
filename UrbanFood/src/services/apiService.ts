import { User } from "../features/auth/authTypes";
import { Dish } from "../features/dishes/dishesType";
import { encodeBase64 } from "../utils/ base64";
import { githubApi, rawApi } from "./apiClient";

// ─── DISHES ───────────────────────────────────────────────────────────────────

export const fetchDishesAPI = async (): Promise<Dish[]> => {
  try {
    const res = await rawApi.get("/dishes.json");
    
    let data = res.data;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.dishes)) {
      return data.dishes;
    } else {
      console.error("Unexpected dishes format");
      return [];
    }
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return [];
  }
};

export const getDishesMeta = async () => {
  const res = await githubApi.get("/dishes.json");
  return res.data;
};

export const updateDishesAPI = async (updatedData: Dish[], sha: string) => {
  const content = encodeBase64(updatedData);
  const res = await githubApi.put("/dishes.json", {
    message: "Update dishes",
    content,
    sha,
  });
  return res.data;
};

// ─── USERS ────────────────────────────────────────────────────────────────────

export const fetchUsersAPI = async (): Promise<User[]> => {
  try {
    const res = await rawApi.get("/users.json");
    
    let data = res.data;
    
    // If it's a string, parse it
    if (typeof data === 'string') {
      // Fix incomplete JSON (missing opening brace)
      if (data.trim().startsWith('"users":')) {
        data = '{' + data + '}';
      }
      data = JSON.parse(data);
    }
    
    // Handle different response formats
    if (Array.isArray(data)) {
      console.log("✅ Fetched users:", data.length);
      return data;
    } else if (data && Array.isArray(data.users)) {
      console.log("✅ Fetched users:", data.users.length);
      return data.users;
    } else {
      console.error("❌ Unexpected users format");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return [];
  }
};

export const getUsersMeta = async () => {
  const res = await githubApi.get("/users.json");
  return res.data;
};

export const updateUsersAPI = async (updatedUsers: User[], sha: string) => {
  const content = encodeBase64(updatedUsers);
  const res = await githubApi.put("/users.json", {
    message: "Update users",
    content,
    sha,
  });
  return res.data;
};
