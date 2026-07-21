import { create } from "zustand";

export interface ChildProfile {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  balance: number;
}

export interface LearningReport {
  id: string;
  childId: string;
  date: string;
  subject: string;
  tutorName: string;
  summary: string;
  characters: string[]; // e.g. ["Fokus", "Aktif"]
  photoUrl: string;
}

interface FamilyState {
  children: ChildProfile[];
  activeChildId: string | null;
  reports: LearningReport[];
  setActiveChild: (id: string) => void;
  addChild: (child: ChildProfile) => void;
  addReport: (report: LearningReport) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  children: [
    {
      id: "c1",
      name: "Delia Puspitasari",
      grade: "SMA Kelas 11",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      balance: 150000,
    },
    {
      id: "c2",
      name: "Kevin Santoso",
      grade: "SMP Kelas 8",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200&h=200",
      balance: 50000,
    }
  ],
  activeChildId: null,
  reports: [
    {
      id: "r1",
      childId: "c1",
      date: "18 April 2026",
      subject: "Matematika SMA",
      tutorName: "Budi Santoso, S.Pd",
      summary: "Memahami konsep limit fungsi aljabar dengan sangat baik.",
      characters: ["Fokus", "Pemahaman Cepat"],
      photoUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=400&h=300"
    }
  ],
  setActiveChild: (id) => set({ activeChildId: id }),
  addChild: (child) => set((state) => ({ children: [...state.children, child] })),
  addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
}));
