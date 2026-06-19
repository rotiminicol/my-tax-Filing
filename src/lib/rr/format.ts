export const formatNaira = (n: number | string) => {
  const num = typeof n === "string" ? Number(n.replace(/[^\d.-]/g, "")) : n;
  if (!Number.isFinite(num)) return "₦0";
  return "₦" + num.toLocaleString("en-NG", { maximumFractionDigits: 0 });
};

export const parseNaira = (s: string) => {
  const n = Number(s.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const formatTIN = (s: string) => {
  const d = s.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "-" + d.slice(2);
};

export const generateReceiptId = () => {
  const y = new Date().getFullYear();
  const r = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
  return `RR-${y}-${r}`;
};

export const maskTIN = (tin: string) => {
  const d = tin.replace(/\D/g, "");
  if (d.length < 4) return tin;
  return d.slice(0, 2) + "-" + "*".repeat(Math.max(0, d.length - 4)) + d.slice(-2);
};
