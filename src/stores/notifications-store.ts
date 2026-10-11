import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "./persist";

interface NotificationsState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      enabled: true,
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: "notifications-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
