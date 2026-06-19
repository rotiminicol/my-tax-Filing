import { Link } from "react-router-dom";
import logoPng from "@/assets/logo.png";

interface FiscalBrandProps {
  /** Light text for dark backgrounds (footer) */
  inverted?: boolean;
  className?: string;
  size?: number;
}

export default function FiscalBrand({ inverted = false, className = "", size = 64 }: FiscalBrandProps) {
  return (
    <Link to="/" className="inline-flex items-center select-none group decoration-none">
      <img
        src={logoPng}
        alt="MyTaxFiling Logo"
        width={size}
        height={size}
        className={`shrink-0 select-none rounded-full ${className}`}
        style={{ objectFit: 'contain' }}
      />
    </Link>
  );
}

