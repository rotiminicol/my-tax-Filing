import { useEffect, useRef, type ReactElement } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { Lock, Shield, RefreshCw } from "lucide-react";
import { fiscal } from "@/components/fiscal-landing/tokens";

const HEADER_GREEN = fiscal.primaryContainer;
const BODY_BG = fiscal.surface;
const TEXT_GREEN = fiscal.primary;
const SHIELD_ACCENT = fiscal.secondary;

interface SignOutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutConfirmModal({
  open,
  onClose,
  onConfirm,
}: SignOutConfirmModalProps): ReactElement | null {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !overlayRef.current || !modalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: -12 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.05 }
      );
      if (iconRingRef.current) {
        gsap.fromTo(
          iconRingRef.current,
          { rotation: -30, opacity: 0.6 },
          {
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      }
    });

    return () => ctx.revert();
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[420px] overflow-hidden rounded-[22px] shadow-2xl shadow-black/25"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative flex items-center justify-center py-10 px-6"
          style={{
            backgroundColor: HEADER_GREEN,
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        >
          <div className="relative w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center shadow-lg">
            <Lock
              className="w-8 h-8 relative z-10"
              style={{ color: HEADER_GREEN }}
              strokeWidth={2}
            />
            <div
              ref={iconRingRef}
              className="absolute inset-0 flex items-center justify-center sign-out-icon-ring"
            >
              <RefreshCw
                className="w-[52px] h-[52px] opacity-90"
                style={{ color: HEADER_GREEN }}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: BODY_BG }}>
          <h2
            id="sign-out-title"
            className="text-xl font-bold tracking-tight"
            style={{ color: TEXT_GREEN }}
          >
            Sign Out Confirmation
          </h2>
          <p className="mt-3 text-sm leading-relaxed max-w-[340px] mx-auto" style={{ color: fiscal.onSurfaceVariant }}>
            Are you sure you want to sign out? Your session is encrypted, and signing out
            ensures your tax data remains protected on this device.
          </p>

          {/* Security tip */}
          <div
            className="mt-6 text-left rounded-xl border px-4 py-3.5 flex gap-3 items-start transition-shadow duration-300 hover:shadow-sm"
            style={{
              backgroundColor: fiscal.surfaceContainerLow,
              borderColor: fiscal.outlineVariant,
            }}
          >
            <Shield
              className="w-5 h-5 shrink-0 mt-0.5"
              style={{ color: SHIELD_ACCENT }}
              strokeWidth={2}
            />
            <div>
              <p className="text-sm font-bold" style={{ color: TEXT_GREEN }}>
                Security Tip
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: fiscal.onSurfaceVariant }}>
                Always sign out when using a shared computer to prevent unauthorized access
                to your Tax Compliance ID and financial records.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="w-full h-12 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md"
              style={{ backgroundColor: HEADER_GREEN }}
            >
              Sign Out
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 rounded-lg text-sm font-semibold border transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              style={{
                borderColor: fiscal.outlineVariant,
                color: TEXT_GREEN,
                backgroundColor: "transparent",
              }}
            >
              Stay Logged In
            </button>
          </div>

          {/* Footer links */}
          <div className="mt-6 flex items-center justify-center gap-6" style={{ color: fiscal.outline }}>
            <Link
              to="/legal/privacy"
              onClick={onClose}
              className="text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/terms"
              onClick={onClose}
              className="text-[10px] font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .sign-out-icon-ring {
          animation: sign-out-ring-spin 8s linear infinite;
        }
        @keyframes sign-out-ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
