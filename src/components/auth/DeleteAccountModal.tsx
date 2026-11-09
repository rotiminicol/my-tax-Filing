import { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const navigate = useNavigate();
  const deleteAccount = useAuth((s) => s.deleteAccount);
  const [confirmationText, setConfirmationText] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const handleDelete = async () => {
    if (confirmationText.trim() !== "DELETE") {
      notify.error("Confirmation required", "Please type DELETE in capital letters to confirm.");
      return;
    }

    setBusy(true);
    try {
      await deleteAccount();
      notify.success(
        "Account Deleted",
        "Your account and all associated tax records have been permanently removed.",
      );
      onClose();
      navigate("/");
    } catch (err) {
      notify.error(
        "Deletion Failed",
        err instanceof Error ? err.message : "Unable to delete account.",
      );
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-red-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-lg font-black uppercase text-red-700"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Delete Account
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Permanent and irreversible action
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-neutral-700 leading-relaxed font-medium">
            This will permanently remove your user profile, tax filings, invoices, receipts, and
            subscriptions from the database.
          </p>
          <div className="p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-[11px] font-bold text-red-800">
              Warning: Once deleted, your account and tax history cannot be recovered.
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Type <span className="font-mono text-red-600">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE"
              disabled={busy}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={confirmationText.trim() !== "DELETE" || busy}
            className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 bg-red-600 text-white transition-all hover:bg-red-700 disabled:opacity-40"
          >
            {busy ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Permanently Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
