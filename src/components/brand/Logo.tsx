import { Link } from "react-router-dom";
import logoPng from "@/assets/logo.png";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 120, className = "" }: LogoMarkProps) {
  return (
    <img
      src={logoPng}
      alt="MyTaxFiling Logo"
      width={size}
      height={size}
      className={`shrink-0 select-none ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
}

interface LogoProps {
  withText?: boolean;
  to?: string;
  size?: number;
  className?: string;
  inverted?: boolean;
}

export default function Logo({
  withText = true,
  to = "/",
  size = 120,
  className = "",
  inverted = false,
}: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center select-none ${className}`}>
      <LogoMark size={size} />
    </span>
  );

  if (!to) return inner;

  return (
    <Link to={to} className="inline-flex items-center group decoration-none">
      {inner}
    </Link>
  );
}