import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";
import { Alert } from "react-native";
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  checkingAuth: true,

  register: async (requestData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (requestData) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);

      set({ user: data.user, token: data.token });
      return { success: true };
    } catch (error) {
      Alert.alert("Error", result.error);

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");
      const user = userJson ? JSON.parse(userJson) : null;
      set({ user, token });
    } catch (error) {
      console.log("Auth check error", error);
      set({ user: null, token: null });
    } finally {
      set({ checkingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
