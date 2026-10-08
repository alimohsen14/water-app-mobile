import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "./persist";

/**
 * User's locale preference: follow the device's system language, or force a
 * specific supported locale regardless of the system setting.
 */
export type LocaleMode = "system" | "en" | "ar";

interface LocaleState {
  mode: LocaleMode;
  setMode: (mode: LocaleMode) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "locale-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
