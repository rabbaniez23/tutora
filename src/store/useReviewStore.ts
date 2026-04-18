import { create } from "zustand";

export interface Review {
  id: string;
  teacherId: string;
  author: string;
  rating: number;
  content: string;
  tags: string[];
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [
    {
      id: "1",
      teacherId: "1",
      author: "Andi Pratama",
      rating: 5,
      content: "Cara menjelaskannya sangat mudah dipahami! Nilai ujian kalkulus saya langsung naik drastis berkat Pak Budi. Recommended!",
      tags: ["Jelas", "Sabar"]
    }
  ],
  addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
}));
