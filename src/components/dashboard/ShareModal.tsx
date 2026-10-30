import { useState } from "react";
import { Send, Mail, Link as LinkIcon, Copy, CheckCircle2, X, Loader2, ShieldCheck, Users } from "lucide-react";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [shareMethod, setShareMethod] = useState<"email" | "link">("email");
  const [emailAddress, setEmailAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const shareLink = "https://mytaxfiling.com/receipts/RC-2024-0891";
  const previewLink = "https://mytaxfiling.com/receipts/preview/RC-2024-0891";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmail = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  const inputStyle = {
    backgroundColor: SB.whisperGray,
    borderColor: SB.cardBorder,
    color: SB.forestInk,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border"
        style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: SB.cardBorder }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold" style={{ color: SB.forestInk }}>
                Share with Employer
              </h3>
              <p className="text-sm mt-1" style={{ color: SB.pencilGray }}>
                Send receipt directly to your employer for payroll processing
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#fcfaf5] transition-colors"
            >
              <X className="w-5 h-5" style={{ color: SB.pencilGray }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Notice */}
          <div
            className="flex items-start gap-3 p-4 rounded-lg border"
            style={{ backgroundColor: "#d5f5c2", borderColor: "rgba(26,51,0,0.15)" }}
          >
            <ShieldCheck className="w-5 h-5 mt-0.5 shrink-0" style={{ color: SB.forestInk }} />
            <div>
              <p className="text-xs font-bold" style={{ color: SB.forestInk }}>
                Secure & Compliant
              </p>
              <p className="text-xs mt-1" style={{ color: SB.pencilGray }}>
                Your receipt will be shared with end-to-end encryption. FCT-IRS compliant sharing methods.
              </p>
            </div>
          </div>

          {/* Share Method Tabs */}
          <div
            className="flex gap-2 p-1 rounded-lg border"
            style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
          >
            {(["email", "link"] as const).map((method) => {
              const isActive = shareMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => setShareMethod(method)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all"
                  style={{
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    color: isActive ? SB.forestInk : SB.pencilGray,
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {method === "email" ? <Mail className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  {method === "email" ? "Email" : "Copy Link"}
                </button>
              );
            })}
          </div>

          {/* Email Share */}
          {shareMethod === "email" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: SB.pencilGray }}>
                  Employer Email Address
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="hr@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f]"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: SB.pencilGray }}>
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please find attached My Tax Filling for the 2026 tax year claim..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] resize-none"
                  style={inputStyle}
                />
              </div>

              {sendSuccess ? (
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: "#d5f5c2" }}>
                  <CheckCircle2 className="w-5 h-5" style={{ color: "#1a5c3a" }} />
                  <p className="text-sm font-bold" style={{ color: "#1a5c3a" }}>
                    Receipt sent successfully to {emailAddress}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleSendEmail}
                  disabled={!emailAddress || isSending}
                  className="w-full px-4 py-2.5 rounded-md font-bold text-xs transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Receipt
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Link Share */}
          {shareMethod === "link" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {[
                { label: "Preview Link", value: previewLink, onCopy: handleCopyLink },
                {
                  label: "Direct Download Link",
                  value: shareLink,
                  onCopy: () => {
                    navigator.clipboard.writeText(shareLink);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  },
                },
              ].map(({ label, value, onCopy }) => (
                <div key={label}>
                  <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: SB.pencilGray }}>
                    {label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={value}
                      className="flex-1 px-4 py-2.5 rounded-lg border outline-none text-sm font-mono"
                      style={{ backgroundColor: SB.whisperGray, borderColor: SB.cardBorder, color: SB.forestInk }}
                    />
                    <button
                      onClick={onCopy}
                      className="px-4 py-2.5 rounded-lg border font-bold text-xs flex items-center gap-2 transition-colors hover:bg-[#fcfaf5]"
                      style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" style={{ color: "#1a5c3a" }} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              <div
                className="p-4 rounded-lg border"
                style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
              >
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 shrink-0" style={{ color: SB.forestInk, opacity: 0.5 }} />
                  <div className="text-xs space-y-1" style={{ color: SB.pencilGray }}>
                    <p className="font-bold" style={{ color: SB.forestInk }}>About sharing links:</p>
                    <ul className="space-y-1">
                      <li>• Preview link: Employer can view receipt online</li>
                      <li>• Download link: Direct PDF download for their records</li>
                      <li>• Links are valid for 30 days from creation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor: SB.cardBorder }}>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-md border text-xs font-bold transition-colors hover:bg-[#fcfaf5]"
            style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
