import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CopyButton({
  text,
  "data-testid": dataTestId,
  className,
}: {
  text: string;
  "data-testid"?: string;
  className?: string;
}) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied",
        description: "Prompt copied to clipboard.",
      });
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={onCopy}
      data-testid={dataTestId}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5",
        "hover:bg-white/10 active:bg-white/10",
        "shadow-sm transition-all duration-200",
        "ring-focus",
        className,
      )}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/.18),transparent_55%)]" />
      <span className="relative inline-flex items-center gap-2">
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        <span className="text-sm font-semibold">{copied ? "Copied" : "Copy"}</span>
      </span>
    </Button>
  );
}
