import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon,
  title,
  description,
  children,
  className,
}: PropsWithChildren<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "surface-glass rounded-3xl p-8 md:p-10",
        "text-center",
        className,
      )}
    >
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="mt-4 text-lg md:text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </div>
  );
}
