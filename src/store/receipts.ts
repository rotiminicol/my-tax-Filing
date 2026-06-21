import { create } from "zustand";
import type { Receipt } from "@/lib/rr/types";
import { emitAppNotification } from "@/lib/events";
import { supabase } from "@/integrations/supabase/client";

interface State {
  receipts: Receipt[];
  add: (r: Receipt) => void;
  remove: (id: string) => void;
  clear: () => void;
  get: (id: string) => Receipt | undefined;
  hydrate: (userId: string) => Promise<void>;
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function rowToReceipt(row: Record<string, unknown>): Receipt {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    status: (row.status as Receipt["status"]) ?? "draft",
    taxpayer: (row.taxpayer as Receipt["taxpayer"]) ?? ({} as Receipt["taxpayer"]),
    landlord: (row.landlord as Receipt["landlord"]) ?? ({} as Receipt["landlord"]),
    employer: (row.employer as Receipt["employer"]) ?? ({} as Receipt["employer"]),
    declaration: !!row.declaration,
    signatureData: (row.signature_data as string | null) ?? undefined,
    typedSignature: (row.typed_signature as string | null) ?? undefined,
    sigMode: (row.sig_mode as Receipt["sigMode"]) ?? undefined,
    certifiedDate: (row.certified_date as string | null) ?? undefined,
  };
}

async function pushReceipt(r: Receipt, userId: string) {
  if (!isUuid(r.id)) return;
  await supabase.from("receipts").upsert({
    id: r.id,
    user_id: userId,
    status: r.status,
    taxpayer: r.taxpayer,
    landlord: r.landlord,
    employer: r.employer,
    declaration: r.declaration,
    signature_data: r.signatureData ?? null,
    typed_signature: r.typedSignature ?? null,
    sig_mode: r.sigMode ?? null,
    certified_date: r.certifiedDate ?? null,
  } as never);
}

export const useReceiptsStore = create<State>()((set, get) => ({
  receipts: [],
  add: (r) => {
    set((s) => ({ receipts: [r, ...s.receipts.filter((x) => x.id !== r.id)] }));
    emitAppNotification({
      level: "success",
      title: "Receipt saved",
      description: `${r.taxpayer?.fullName ?? "Receipt"} • Ref ${r.id}`,
    });
    const uid = currentUserId();
    if (uid) void pushReceipt(r, uid);
  },
  remove: (id) => {
    set((s) => ({ receipts: s.receipts.filter((r) => r.id !== id) }));
    emitAppNotification({ level: "info", title: "Receipt removed", description: "Receipt removed from your dashboard." });
    const uid = currentUserId();
    if (uid && isUuid(id)) void supabase.from("receipts").delete().eq("id", id);
  },
  clear: () => set({ receipts: [] }),
  get: (id) => get().receipts.find((r) => r.id === id),
  hydrate: async (userId) => {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error || !data) return;
    set({ receipts: (data as unknown as Record<string, unknown>[]).map(rowToReceipt) });
  },
}));

let _userId: string | null = null;
function currentUserId(): string | null {
  return _userId;
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user?.id ?? null;
    _userId = uid;
    if (uid) void useReceiptsStore.getState().hydrate(uid);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    const uid = session?.user?.id ?? null;
    _userId = uid;
    if (event === "SIGNED_OUT" || !uid) {
      useReceiptsStore.setState({ receipts: [] });
    } else if (event === "SIGNED_IN") {
      void useReceiptsStore.getState().hydrate(uid);
    }
  });
}
