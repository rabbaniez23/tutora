import { create } from "zustand";

type Role = "customer" | "teacher" | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  login: (role) => set({ isAuthenticated: true, role }),
  logout: () => set({ isAuthenticated: false, role: null }),
}));
