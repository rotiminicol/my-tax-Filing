import { useState } from "react";
import { X } from "lucide-react";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { useInvoicingStore } from "@/store/invoicing";
import { notify } from "@/components/Toaster";

const SB = {
  forestInk: "#1a3300",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded?: (clientId: string) => void;
}

export default function AddClientModal({ open, onClose, onAdded }: Props) {
  const addClient = useInvoicingStore((s) => s.addClient);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  if (!open) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCity("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.error("Name required", "Enter a client or business name.");
      return;
    }
    const client = addClient({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      city: city.trim() || undefined,
    });
    notify.success("Client added", `${client.name} is ready for invoicing.`);
    reset();
    onAdded?.(client.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ ...cardElevation, backgroundColor: "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: SB.forestInk }}>
            Add client
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#fcfaf5] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" style={{ color: SB.pencilGray }} />
          </button>
        </div>

        <Field label="Business / client name" required>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder }}
            placeholder="e.g. Acme Consulting Ltd"
            required
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder }}
            placeholder="billing@company.com"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder }}
            placeholder="+234 800 000 0000"
          />
        </Field>
        <Field label="City / location">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder }}
            placeholder="e.g. Lagos, Nigeria"
          />
        </Field>

        <button
          type="submit"
          className="w-full py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
        >
          Save client
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#1a3300]/20 focus:border-[#1a3300]";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#1a3300" }}>
        {label}
        {required && <span style={{ color: "#991b1b" }}> *</span>}
      </label>
      {children}
    </div>
  );
}
