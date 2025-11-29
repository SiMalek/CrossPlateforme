import { create } from "zustand";
import { authenticateUser } from "../api/userService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Attempting login with:", email);
      const user = await authenticateUser(email, password);
      console.log("Authentication result:", user ? "success" : "failed");
      
      if (user) {
        console.log("User logged in:", user.name, "Role:", user.role);
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        console.log("Invalid credentials");
        set({ error: "Email ou mot de passe incorrect", isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ error: "Erreur de connexion", isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
