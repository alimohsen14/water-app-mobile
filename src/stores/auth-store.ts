import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "./persist";

/** Fixed demo credentials. Replace with a real auth backend later. */
const DEMO_USERNAME = "itec";
const DEMO_PASSWORD = "itec1234";

interface AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (username, password) => {
        const ok =
          username.trim() === DEMO_USERNAME &&
          password.trim() === DEMO_PASSWORD;
        if (ok) set({ isAuthenticated: true });
        return ok;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
