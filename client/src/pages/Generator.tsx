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
import { ModelSelector } from "@/components/ModelSelector";

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
  const [model, setModel] = useState<string>("stabilityai/stable-diffusion-3.5-large");
  const [size, setSize] = useState<CreateImageInput["size"]>("1024x1024");
  const [n, setN] = useState<number>(2);

  const canGenerate = prompt.trim().length >= 3 && !create.isPending;

  const result = create.data;


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
          <span className="font-black text-white uppercase tracking-tighter">
            IMAGINE <span className="text-neutral-500">ENGINE</span>
          </span>
        }
        subtitle="Prompt-to-pixel synthesis with high-fidelity control over resolution and model parameters."
        right={
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="rounded-lg border-neutral-700 bg-neutral-800 text-[10px] font-black uppercase text-neutral-300">
              {model.split("/").pop()}
            </Badge>
            <Badge variant="outline" className="rounded-lg border-neutral-700 bg-neutral-800 text-[10px] font-black uppercase text-neutral-300">
              {size}
            </Badge>
          </div>
        }
      />

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 border border-neutral-800 bg-neutral-900 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                    <Wand2 className="h-5 w-5 text-neutral-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white">Neural Composer</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">Direct Directive Input</p>
                  </div>
                </div>
                <CopyButton text={prompt} />
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-3 px-1">
                    Directive Buffer
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter visual descriptors..."
                    className="min-h-[160px] resize-none rounded-xl bg-neutral-950/50 border-neutral-800 text-lg focus-visible:ring-emerald-500/20 pretty-scroll"
                  />

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
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-neutral-800 bg-neutral-900/50 text-neutral-500 hover:bg-neutral-800 hover:text-white transition-all duration-300"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block px-1">
                      Model Core
                    </label>
                    <ModelSelector value={model} onValueChange={setModel} type="image" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block px-1">
                      Resolution
                    </label>
                    <Select
                      value={size}
                      onValueChange={(v) => setSize(v as CreateImageInput["size"])}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-neutral-800 border-neutral-700 text-neutral-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-neutral-800">
                        {SIZES.map((s) => (
                          <SelectItem key={s.id} value={s.id} className="focus:bg-neutral-800">
                            <span className="font-bold text-xs">{s.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block px-1">
                      Frame Density
                    </label>
                    <Select
                      value={String(n)}
                      onValueChange={(v) => setN(Number(v))}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-neutral-800 border-neutral-700 text-neutral-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-neutral-800">
                        {[1, 2, 3, 4].map((k) => (
                          <SelectItem key={k} value={String(k)} className="focus:bg-neutral-800">
                            {k} frame{k === 1 ? "" : "s"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={onGenerate}
                      disabled={!canGenerate}
                      className="h-11 w-full rounded-xl font-black uppercase tracking-widest text-[11px] bg-neutral-100 hover:bg-white text-neutral-900 transition-all shadow-xl shadow-white/5"
                    >
                      {create.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Initiate Synthesis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: output */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 border border-neutral-800 bg-neutral-900 rounded-2xl shadow-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                    <Aperture className="h-4 w-4 text-neutral-400" />
                  </div>
                  <h2 className="text-lg font-black uppercase tracking-tighter text-white">Visual Output</h2>
                </div>
                {result?.images?.length ? (
                  <Badge variant="outline" className="border-neutral-700 text-neutral-500 font-black text-[9px] uppercase">
                    {result.images.length} Units
                  </Badge>
                ) : null}
              </div>

              <div>
                {create.isPending ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-950/50 border border-neutral-800 border-dashed">
                      <Loader2 className="h-4 w-4 animate-spin text-neutral-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Processing Stream...</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Array.from({ length: Math.max(2, Math.min(4, n)) }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-2xl bg-neutral-800/50 border border-neutral-700 animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ) : result?.images?.length ? (
                  <ImageGrid images={result.images} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <Sparkles className="h-12 w-12 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Buffer Empty</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-4">Precision Checklist</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Subject Focal Point",
                  "Optical Parameters",
                  "Atmospheric Haze",
                  "Chroma Balance",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-neutral-700 shrink-0" />
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{t}</span>
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
