const defaultSteps = ["Taxpayer", "Landlord", "Employer", "Review"];

export default function StepIndicator({ current, steps = defaultSteps }: { current: number; steps?: string[] }) {
  return (
    <ol className="w-full flex items-center gap-2">
      {steps.map((s, i) => {
        const active = i === current, done = i < current;
        return (
          <li key={s} className="flex-1 flex items-center gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`h-8 w-8 rounded-full grid place-items-center font-bold text-xs border transition-all duration-300
                ${active ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" : ""}
                ${done ? "border-primary bg-primary text-primary-foreground" : ""}
                ${!active && !done ? "border-border bg-slate-100 dark:bg-slate-800 text-muted-foreground" : ""}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`hidden sm:block text-[10px] font-bold uppercase tracking-widest ${active ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${done ? "bg-primary" : "bg-border"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

