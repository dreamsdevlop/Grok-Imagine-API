import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Img = { mimeType: string; dataBase64: string };

function downloadDataUrl(filename: string, dataUrl: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ImageGrid({
  images,
  className,
  testId,
}: {
  images: Img[];
  className?: string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className={cn(
        "grid gap-4 sm:gap-5",
        images.length <= 1
          ? "grid-cols-1"
          : images.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {images.map((img, idx) => {
        const src = `data:${img.mimeType};base64,${img.dataBase64}`;
        return (
          <figure
            key={`${idx}-${img.mimeType}`}
            className={cn(
              "group relative overflow-hidden rounded-3xl",
              "border border-white/10 bg-white/[0.03]",
              "shadow-[0_18px_55px_rgba(0,0,0,.45)]",
              "transition-transform duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_22px_65px_rgba(0,0,0,.6)]",
            )}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/.20),transparent_55%),radial-gradient(circle_at_80%_20%,hsl(var(--accent)/.16),transparent_55%)]" />
            <img
              data-testid={`img-generated-${idx}`}
              src={src}
              alt={`Generated image ${idx + 1}`}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-md">
                <figcaption className="text-xs text-muted-foreground">
                  #{idx + 1}
                </figcaption>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
                  onClick={() => downloadDataUrl(`imagine-${idx + 1}.png`, src)}
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </figure>
        );
      })}
    </div>
  );
}
