import { create } from "zustand";

interface ToastState {
  message: string;
  visible: boolean;
  type: "success" | "error" | "info";
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: "",
  visible: false,
  type: "success",
  showToast: (message, type = "success") => set({ message, type, visible: true }),
  hideToast: () => set({ visible: false }),
}));
