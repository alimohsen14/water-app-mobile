import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "./persist";

/**
 * User's appearance preference: follow the device's system color scheme, or
 * force light/dark regardless of the system setting.
 */
export type ThemeMode = "system" | "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
