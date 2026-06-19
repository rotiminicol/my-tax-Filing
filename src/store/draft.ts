import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Receipt } from "@/lib/rr/types";

export type DraftReceipt = {
  taxpayer: Partial<Receipt["taxpayer"]>;
  landlord: Partial<Receipt["landlord"]>;
  employer: Partial<Receipt["employer"]>;
  declaration: boolean;
  step: number;
  lastGeneratedId?: string;
};

const empty: DraftReceipt = {
  taxpayer: {}, landlord: { type: "landlord" }, employer: {}, declaration: false, step: 0,
};

interface State {
  draft: DraftReceipt;
  setSection: <K extends keyof DraftReceipt>(k: K, v: DraftReceipt[K]) => void;
  patchTaxpayer: (p: Partial<Receipt["taxpayer"]>) => void;
  patchLandlord: (p: Partial<Receipt["landlord"]>) => void;
  patchEmployer: (p: Partial<Receipt["employer"]>) => void;
  setStep: (n: number) => void;
  setDeclaration: (b: boolean) => void;
  setLastGenerated: (id: string) => void;
  reset: () => void;
}

export const useDraft = create<State>()(
  persist(
    (set) => ({
      draft: empty,
      setSection: (k, v) => set((s) => ({ draft: { ...s.draft, [k]: v } })),
      patchTaxpayer: (p) => set((s) => ({ draft: { ...s.draft, taxpayer: { ...s.draft.taxpayer, ...p } } })),
      patchLandlord: (p) => set((s) => ({ draft: { ...s.draft, landlord: { ...s.draft.landlord, ...p } } })),
      patchEmployer: (p) => set((s) => ({ draft: { ...s.draft, employer: { ...s.draft.employer, ...p } } })),
      setStep: (n) => set((s) => ({ draft: { ...s.draft, step: n } })),
      setDeclaration: (b) => set((s) => ({ draft: { ...s.draft, declaration: b } })),
        setLastGenerated: (id) => set((s) => ({ draft: { ...s.draft, lastGeneratedId: id } })),
        reset: () => set({ draft: empty }),
    }),
    { name: "rr-draft-v1" }
  )
);
