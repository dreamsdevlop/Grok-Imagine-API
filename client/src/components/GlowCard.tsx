import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function GlowCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "surface",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_18px_55px_rgba(0,0,0,.62)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/.22),transparent_55%),radial-gradient(circle_at_80%_0%,hsl(var(--accent)/.18),transparent_55%)] blur-2xl opacity-70" />
      <div className="relative">{children}</div>
    </div>
  );
}
