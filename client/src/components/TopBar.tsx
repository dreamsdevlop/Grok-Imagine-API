import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function TopBar({
  title,
  subtitle,
  right,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mb-6 border-b border-white/10 bg-background/35 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div
              className={cn(
                "text-2xl sm:text-3xl md:text-4xl leading-[1.05]",
                "animate-in-up",
              )}
            >
              {title}
            </div>
            {subtitle ? (
              <div className="mt-2 text-sm text-muted-foreground animate-in-fade">
                {subtitle}
              </div>
            ) : null}
          </div>
          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>
    </header>
  );
}
