import { create } from "zustand";

export const useAnimationStore = create((set) => ({
    hasTypingAnimationPlayed: false, // Track only typing animation
    setHasTypingAnimationPlayed: () => set({ hasTypingAnimationPlayed: true }), 
    resetTypingAnimation: () => set({ hasTypingAnimationPlayed: false }), 
  }));