import { Sun } from "lucide-react";

export function SolarLogo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#home" className="group flex min-w-0 items-center gap-3" aria-label="Sun Faith Energy Solutions home">
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-md bg-primary text-primary-foreground shadow-brand">
        <Sun className="size-7 transition-transform duration-500 group-hover:rotate-45" strokeWidth={2.4} />
        <span className="absolute -bottom-3 -right-3 size-6 rotate-45 bg-accent" />
      </span>
      <span className={compact ? "hidden sm:block" : "block"}>
        <strong className="block text-[13px] font-extrabold leading-tight tracking-[0.12em] text-foreground">SUN FAITH</strong>
        <span className="block text-[10px] font-semibold tracking-[0.18em] text-primary">ENERGY SOLUTIONS</span>
      </span>
    </a>
  );
}
