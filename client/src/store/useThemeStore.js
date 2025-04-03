import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",  // Initialize theme from localStorage or default to "coffee"

  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);  // Save the theme to localStorage
    set({ theme });  // Update the theme state in the store
  },
}));
