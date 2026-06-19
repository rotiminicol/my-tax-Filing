import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage500() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="text-center max-w-md">
        <span className="grid place-items-center mx-auto h-14 w-14 rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <p className="mt-4 font-mono tracking-[0.22em] text-[10px] text-muted-foreground uppercase">Error 500</p>
        <h1 className="mt-2 text-5xl font-black">Something gave way.</h1>
        <p className="mt-3 text-sm text-muted-foreground">An unexpected error occurred on our end.</p>
        <Link to="/" className="mt-7 inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium tracking-wide hover:opacity-90">Return home</Link>
      </div>
    </div>
  );
}
