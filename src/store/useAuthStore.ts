import { create } from "zustand";

export type Role = "customer" | "teacher" | "parent" | null;
export type TutorStatus = "draft" | "review_video" | "approved";

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  tutorStatus: TutorStatus;
  login: (role: Role) => void;
  logout: () => void;
  setTutorStatus: (status: TutorStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  tutorStatus: "draft",
  login: (role) => set({ isAuthenticated: true, role }),
  logout: () => set({ isAuthenticated: false, role: null, tutorStatus: "draft" }),
  setTutorStatus: (status) => set({ tutorStatus: status }),
}));
