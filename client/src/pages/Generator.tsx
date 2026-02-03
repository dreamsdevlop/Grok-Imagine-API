import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import CopyButton from "@/components/CopyButton";
import ImageGrid from "@/components/ImageGrid";
import EmptyState from "@/components/EmptyState";
import { useCreateImageGeneration } from "@/hooks/use-images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Aperture, Sparkles, Wand2, Loader2 } from "lucide-react";
import type { CreateImageInput } from "@shared/routes";

const MODELS = [
  { id: "grok-2-image", label: "Grok 2 Image" },
  { id: "grok-vision-beta", label: "Grok Vision (beta)" },
  { id: "sdxl-turbo", label: "SDXL Turbo" },
  { id: "flux-schnell", label: "Flux Schnell" },
] as const;

const SIZES = [
  { id: "512x512", label: "512", hint: "Fast previews" },
  { id: "768x768", label: "768", hint: "Balanced" },
  { id: "1024x1024", label: "1024", hint: "Best detail" },
] as const;

export default function Generator() {
  const { toast } = useToast();
  const create = useCreateImageGeneration();

  const [prompt, setPrompt] = useState(
    "A neon-lit koi fish made of liquid chrome, swimming through a dark glass ocean, cinematic lighting, ultra-detailed, 35mm photo, soft bloom",
  );
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [size, setSize] = useState<CreateImageInput["size"]>("1024x1024");
  const [n, setN] = useState<number>(2);

  const canGenerate = prompt.trim().length >= 3 && !create.isPending;

  const result = create.data;

  const modelLabel = useMemo(
    () => MODELS.find((m) => m.id === model)?.label ?? model,
    [model],
  );

  useEffect(() => {
    if (create.isError) {
      toast({
        title: "Generation failed",
        description: (create.error as Error)?.message ?? "Unknown error",
        variant: "destructive",
      });
    }
  }, [create.isError, create.error, toast]);

  const onGenerate = async () => {
    if (!canGenerate) return;

    await create.mutateAsync({
      prompt,
      model,
      n,
      size,
    });
  };

  const quickChips = [
    "cinematic",
    "macro",
    "editorial",
    "soft haze",
    "rim light",
    "high contrast",
    "ultra-detailed",
  ];

  return (
    <AppShell>
      <Seo
        title="Imagine Studio — Generator"
        description="Grok Imagine-style image generator. Craft prompts, choose model & size, generate 1–4 images instantly."
      />

      <TopBar
        title={
          <span>
            Generate{" "}
            <span className="text-gradient">images</span> with style
          </span>
        }
        subtitle={
          <span>
            Precision controls, premium gallery output. Build a prompt, pick a model, and
            ship visuals.
          </span>
        }
        right={
          <div className="hidden md:flex items-center gap-2">
            <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
              {modelLabel}
            </Badge>
            <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
              {size}
            </Badge>
          </div>
        }
      />

      <main className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-6 lg:gap-8 items-start">
          {/* Left: form */}
          <GlowCard className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-white/10">
                    <Wand2 className="h-4 w-4 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl">Prompt composer</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Describe the subject, style, lighting, and camera. The more intentional, the better.
                </p>
              </div>
              <CopyButton text={prompt} data-testid="button-copy-prompt" />
            </div>

            <div className="mt-5">
              <label className="text-sm font-semibold text-foreground/90">
                Prompt
              </label>
              <div className="mt-2">
                <Textarea
                  data-testid="input-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to see…"
                  className={cn(
                    "min-h-[160px] resize-y rounded-2xl",
                    "bg-white/[0.03] border-white/10",
                    "focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:border-primary/40",
                    "pretty-scroll",
                  )}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {quickChips.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      setPrompt((p) =>
                        p.includes(c) ? p : `${p.trim().replace(/\s+$/, "")}, ${c}`,
                      )
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold",
                      "border border-white/10 bg-white/5 text-foreground/85",
                      "hover:bg-white/10 hover:-translate-y-[1px] active:translate-y-0",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
                    )}
                  >
                    + {c}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-6 bg-white/10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground/90">
                  Model
                </label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger
                    data-testid="select-model"
                    className={cn(
                      "mt-2 h-12 rounded-2xl",
                      "bg-white/[0.03] border-white/10",
                      "focus:ring-4 focus:ring-ring/20 focus:border-primary/40",
                    )}
                  >
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                    {MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tip: switch models to explore aesthetics.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground/90">
                  Size
                </label>
                <Select
                  value={size}
                  onValueChange={(v) => setSize(v as CreateImageInput["size"])}
                >
                  <SelectTrigger
                    data-testid="select-size"
                    className={cn(
                      "mt-2 h-12 rounded-2xl",
                      "bg-white/[0.03] border-white/10",
                      "focus:ring-4 focus:ring-ring/20 focus:border-primary/40",
                    )}
                  >
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                    {SIZES.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center justify-between gap-8">
                          <span>{s.label}</span>
                          <span className="text-xs text-muted-foreground">{s.hint}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  Higher sizes yield more detail.
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground/90">
                  Count
                </label>
                <Select
                  value={String(n)}
                  onValueChange={(v) => setN(Number(v))}
                >
                  <SelectTrigger
                    data-testid="select-count"
                    className={cn(
                      "mt-2 h-12 rounded-2xl",
                      "bg-white/[0.03] border-white/10",
                      "focus:ring-4 focus:ring-ring/20 focus:border-primary/40",
                    )}
                  >
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                    {[1, 2, 3, 4].map((k) => (
                      <SelectItem key={k} value={String(k)}>
                        {k} image{k === 1 ? "" : "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  Generate up to 4 variations.
                </p>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  data-testid="button-generate"
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  className={cn(
                    "h-12 w-full rounded-2xl font-semibold",
                    "bg-gradient-to-r from-primary to-accent",
                    "text-primary-foreground shadow-[0_18px_55px_rgba(0,0,0,.55)]",
                    "hover:shadow-[0_22px_65px_rgba(0,0,0,.65)] hover:-translate-y-0.5",
                    "active:translate-y-0 active:shadow-[0_14px_40px_rgba(0,0,0,.55)]",
                    "disabled:opacity-60 disabled:transform-none",
                    "transition-all duration-200 ease-out ring-focus",
                  )}
                >
                  {create.isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </GlowCard>

          {/* Right: output */}
          <div className="space-y-6">
            <GlowCard className="p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-white/10">
                      <Aperture className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl">Output</h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your generated images appear here. Download and iterate.
                  </p>
                </div>
                {result?.error ? (
                  <Badge className="rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                    Error
                  </Badge>
                ) : result?.images?.length ? (
                  <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
                    {result.images.length} image{result.images.length === 1 ? "" : "s"}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-5">
                {create.isPending ? (
                  <div className="surface-glass rounded-3xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 blur-lg opacity-70" />
                        <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">Generating</div>
                        <div className="text-xs text-muted-foreground">
                          This can take a few seconds depending on the model.
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      {Array.from({ length: Math.max(2, Math.min(4, n)) }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-3xl border border-white/10 bg-white/[0.03] animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ) : result?.images?.length ? (
                  <ImageGrid images={result.images} testId="grid-images" />
                ) : (
                  <EmptyState
                    icon={<Sparkles className="h-6 w-6 text-primary" />}
                    title="No images yet"
                    description="Write a prompt and hit Generate. Your gallery will bloom here with crisp squares and downloadable files."
                  />
                )}

                {result?.error ? (
                  <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
                    <div className="font-semibold text-destructive">Server error</div>
                    <div className="mt-1 text-muted-foreground">
                      {result.error}
                    </div>
                  </div>
                ) : null}
              </div>
            </GlowCard>

            <div className="surface-glass rounded-3xl p-5 sm:p-6">
              <div className="text-sm font-semibold">Prompt quality checklist</div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                {[
                  "Subject: who/what is the focus?",
                  "Style: photo, illustration, 3D, anime…",
                  "Lighting: rim, volumetric, softbox…",
                  "Lens: 35mm, 85mm, macro…",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <span className="text-foreground/90 font-semibold">•</span>{" "}
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
