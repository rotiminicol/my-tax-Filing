import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { useInvoicingStore } from "@/store/invoicing";
import { notify } from "@/components/Toaster";
import { clientInitials } from "@/lib/invoicing";
import { ArrowLeft, Building2, Mail, MapPin, Phone, Trash2, UserPlus } from "lucide-react";

function ManageClientsRoute() {
  const clients = useInvoicingStore((s) => s.clients);
  const addClient = useInvoicingStore((s) => s.addClient);
  const updateClient = useInvoicingStore((s) => s.updateClient);
  const removeClient = useInvoicingStore((s) => s.removeClient);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("");
  };

  const startEdit = (id: string) => {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setName(c.name);
    setEmail(c.email ?? "");
    setPhone(c.phone ?? "");
    setAddress(c.address ?? "");
    setCity(c.city ?? "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.error("Name required", "Enter a client or business name.");
      return;
    }
    const payload = {
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
    };
    if (editingId) {
      updateClient(editingId, payload);
      notify.success("Client updated", `${payload.name} saved.`);
    } else {
      addClient(payload);
      notify.success("Client added", `${payload.name} added.`);
    }
    resetForm();
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/customer-dashboard/invoicing/manage"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
          style={{ color: fiscal.onSurfaceVariant }}
        >
          <ArrowLeft className="w-4 h-4" />
          E-Invoicing
        </Link>

        <header>
          <h1 className="text-2xl font-bold" style={{ color: fiscal.primary }}>
            Manage clients
          </h1>
          <p className="text-sm mt-1" style={{ color: fiscal.onSurfaceVariant }}>
            Add and edit clients used in your invoices.
          </p>
        </header>

        <section className="rounded-xl p-6" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: fiscal.primary }}>
            <UserPlus className="w-5 h-5" />
            {editingId ? "Edit client" : "Add client"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Name" icon={<Building2 className="w-4 h-4" />}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Business or individual name"
                required
              />
            </Field>
            <Field label="Email" icon={<Mail className="w-4 h-4" />}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="billing@company.com"
              />
            </Field>
            <Field label="Phone" icon={<Phone className="w-4 h-4" />}>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+234 800 000 0000"
              />
            </Field>
            <Field label="Address" icon={<MapPin className="w-4 h-4" />}>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${inputClass} resize-none`}
                rows={2}
                placeholder="Street address"
              />
            </Field>
            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                placeholder="Lagos, Nigeria"
              />
            </Field>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
                style={{ backgroundColor: fiscal.primary }}
              >
                {editingId ? "Save changes" : "Add client"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 rounded-xl font-medium text-sm border"
                  style={{ borderColor: fiscal.outlineVariant }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl p-6" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: fiscal.primary }}>
            Your clients ({clients.length})
          </h2>
          {clients.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: fiscal.onSurfaceVariant }}>
              No clients yet. Add one above to start invoicing.
            </p>
          ) : (
            <ul className="space-y-3">
              {clients.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: fiscal.surfaceContainerLow }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: fiscal.primaryFixed, color: fiscal.onPrimaryFixed }}
                  >
                    {clientInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{c.name}</p>
                    <p className="text-xs truncate" style={{ color: fiscal.onSurfaceVariant }}>
                      {[c.email, c.phone, c.city].filter(Boolean).join(" · ") || "No contact details"}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(c.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg"
                      style={{ color: fiscal.primary }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeClient(c.id);
                        notify.info("Removed", `${c.name} deleted.`);
                        if (editingId === c.id) resetForm();
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      aria-label={`Remove ${c.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: fiscal.onSurface }}>
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export default ManageClientsRoute;
