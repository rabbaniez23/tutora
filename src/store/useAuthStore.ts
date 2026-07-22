import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Role = "customer" | "teacher" | "parent" | null;
export type TutorStatus = "draft" | "review_video" | "approved";

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  tutorStatus: TutorStatus;
  _hasHydrated: boolean;
  login: (role: Role) => void;
  logout: () => void;
  setTutorStatus: (status: TutorStatus) => void;
  setHasHydrated: (state: boolean) => void;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  tutorStatus: "draft",
  _hasHydrated: false,
  login: async (role) => {
    set({ isAuthenticated: true, role });
    await AsyncStorage.setItem("auth-session", JSON.stringify({ isAuthenticated: true, role }));
  },
  logout: async () => {
    set({ isAuthenticated: false, role: null, tutorStatus: "draft" });
    await AsyncStorage.removeItem("auth-session");
  },
  setTutorStatus: (status) => set({ tutorStatus: status }),
  setHasHydrated: (state) => set({ _hasHydrated: state }),
  loadSession: async () => {
    try {
      const stored = await AsyncStorage.getItem("auth-session");
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ isAuthenticated: parsed.isAuthenticated, role: parsed.role });
      }
    } catch (e) {
      // ignore
    } finally {
      set({ _hasHydrated: true });
    }
  },
}));
