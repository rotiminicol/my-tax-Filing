import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Receipt } from "@/lib/rr/types";
import { emitAppNotification } from "@/lib/events";

interface State {
  receipts: Receipt[];
  add: (r: Receipt) => void;
  remove: (id: string) => void;
  clear: () => void;
  get: (id: string) => Receipt | undefined;
}

export const useReceiptsStore = create<State>()(
  persist(
    (set, get) => ({
      receipts: [],
      add: (r) => {
        set((s) => ({ receipts: [r, ...s.receipts.filter((x) => x.id !== r.id)] }));
        emitAppNotification({
          level: "success",
          title: "Receipt saved",
          description: `${r.taxpayer?.fullName ?? "Receipt"} • Ref ${r.id}`,
        });
      },
      remove: (id) => {
        set((s) => ({ receipts: s.receipts.filter((r) => r.id !== id) }));
        emitAppNotification({ level: "info", title: "Receipt removed", description: "Receipt removed from your dashboard." });
      },
      clear: () => set({ receipts: [] }),
      get: (id) => get().receipts.find((r) => r.id === id),
    }),
    { name: "rr-receipts-v1" }
  )
);
