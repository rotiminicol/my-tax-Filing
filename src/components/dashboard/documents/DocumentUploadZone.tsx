import { useRef } from "react";
import { CloudUpload } from "lucide-react";
import { notify } from "@/components/Toaster";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png";

interface Props {
  onFile?: (fileName: string) => void;
  compact?: boolean;
}

export default function DocumentUploadZone({ onFile, compact }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (file.size > MAX_BYTES) {
      notify.error("File too large", "Maximum size is 10MB.");
      return;
    }
    onFile?.(file.name);
    notify.success("Document attached", file.name);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors group cursor-pointer ${
          compact ? "p-6" : "p-8"
        }`}
        style={{
          borderColor: "rgba(26,51,0,0.15)",
          backgroundColor: "#fcfaf5",
        }}
        onClick={() => inputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f1f1f1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#fcfaf5";
        }}
      >
        <div
          className={`rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
            compact ? "w-12 h-12" : "w-16 h-16"
          }`}
          style={{ backgroundColor: "#d5f5c2" }}
        >
          <CloudUpload
            className={compact ? "w-6 h-6" : "w-8 h-8"}
            style={{ color: "#1a3300" }}
          />
        </div>
        <p
          className={`font-bold text-center ${compact ? "text-base" : "text-xl"}`}
          style={{ color: "#1a3300" }}
        >
          Click or drop document here
        </p>
        <p className="text-xs mt-2" style={{ color: "#b6b6b6" }}>
          PDF, JPG, PNG up to 10MB
        </p>
      </button>
    </>
  );
}
