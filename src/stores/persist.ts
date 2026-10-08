import type { StateStorage } from "zustand/middleware";

import { storage } from "@/utils/storage";

/**
 * Zustand `StateStorage` adapter backed by the app's local storage.
 * Use with `createJSONStorage(() => zustandStorage)` in the `persist` middleware.
 */
export const zustandStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
};
