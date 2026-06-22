import { supabase } from "@/integrations/supabase/client";

export interface AdminProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  account_type: "individual" | "organization" | null;
  onboarded: boolean;
  created_at: string;
}

export interface AdminSubRow {
  user_id: string;
  plan: "free" | "deluxe" | "premium";
  status: string;
  billing_cycle: string | null;
  current_period_end: string | null;
}

export interface AdminReceiptRow {
  id: string;
  user_id: string;
  status: string;
  taxpayer: { fullName?: string; amount?: number } | null;
  landlord: { name?: string } | null;
  created_at: string;
  certified_date: string | null;
}

export async function fetchAdminProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, business_name, account_type, onboarded, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminProfileRow[];
}

export async function fetchAdminSubscriptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id, plan, status, billing_cycle, current_period_end");
  if (error) throw error;
  return (data ?? []) as AdminSubRow[];
}

export async function fetchAdminReceipts() {
  const { data, error } = await supabase
    .from("receipts")
    .select("id, user_id, status, taxpayer, landlord, created_at, certified_date")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as unknown as AdminReceiptRow[];
}

export async function fetchAdminRoles() {
  const { data, error } = await supabase.from("user_roles").select("user_id, role");
  if (error) throw error;
  return data ?? [];
}

export async function fetchAuditLog() {
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("id, admin_id, action, target_user_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function promoteUserToAdmin(userId: string) {
  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  if (error) throw error;
  await logAdminAction("promote_to_admin", userId);
}

export async function demoteUserFromAdmin(userId: string) {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error) throw error;
  await logAdminAction("demote_from_admin", userId);
}

export async function logAdminAction(
  action: string,
  targetUserId?: string,
  details?: Record<string, unknown>,
) {
  const { data: sess } = await supabase.auth.getUser();
  if (!sess.user) return;
  await supabase.from("admin_audit_log").insert({
    admin_id: sess.user.id,
    action,
    target_user_id: targetUserId ?? null,
    details: (details ?? null) as never,
  });
}