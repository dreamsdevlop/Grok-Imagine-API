import { useEffect, useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import CopyButton from "@/components/CopyButton";
import EmptyState from "@/components/EmptyState";
import { useVideoGenerations, useVideoGeneration, useCreateVideoGeneration, useToast } from "@/hooks/use-images";
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
import {
    Video,
    Sparkles,
    Wand2,
    Loader2,
    Download,
    Play,
    Eye,
    Clock,
    Monitor
} from "lucide-react";
import type { VideoGenerationResponse } from "@shared/routes";

const MODELS = [
    { id: "grok-video", label: "Grok Video" },
    { id: "sora", label: "Sora" },
    { id: "runway-gen-3", label: "Runway Gen-3" },
    { id: "pika", label: "Pika" },
] as const;

const DURATIONS = [
    { id: 2, label: "2s", hint: "Quick preview" },
    { id: 5, label: "5s", hint: "Standard" },
    { id: 10, label: "10s", hint: "Extended" },
    { id: 15, label: "15s", hint: "Long form" },
] as const;

const ASPECT_RATIOS = [
    { id: "16:9", label: "16:9", width: 1024, height: 576, hint: "Landscape" },
    { id: "9:16", label: "9:16", width: 576, height: 1024, hint: "Portrait" },
    { id: "1:1", label: "1:1", width: 1024, height: 1024, hint: "Square" },
    { id: "21:9", label: "21:9", width: 1280, height: 544, hint: "Cinematic" },
] as const;

export default function VideoGenerator() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState(
        "A futuristic cityscape at sunset, flying cars zooming between neon-lit skyscrapers, cinematic camera movement, hyper-realistic, 4K quality"
    );
    const [model, setModel] = useState<string>(MODELS[0].id);
    const [duration, setDuration] = useState<number>(5);
    const [aspectRatio, setAspectRatio] = useState<string>("16:9");
    const [isProcessing, setIsProcessing] = useState(false);

    const create = useCreateVideoGeneration();
    const result = create.data;

    const aspectRatioConfig = useMemo(
        () => ASPECT_RATIOS.find(ar => ar.id === aspectRatio) || ASPECT_RATIOS[0],
        [aspectRatio]
    );

    const modelLabel = useMemo(
        () => MODELS.find((m) => m.id === model)?.label ?? model,
        [model],
    );

    useEffect(() => {
        if (create.isError) {
            toast({
                title: "Video generation failed",
                description: (create.error as Error)?.message ?? "Unknown error",
                variant: "destructive",
            });
        }
    }, [create.isError, create.error, toast]);

    const onGenerate = async () => {
        if (!prompt.trim() || isProcessing) return;

        setIsProcessing(true);
        try {
            await create.mutateAsync({
                prompt,
                model,
                duration,
                width: aspectRatioConfig.width,
                height: aspectRatioConfig.height,
            });
        } catch (error) {
            toast({
                title: "Generation failed",
                description: error instanceof Error ? error.message : "Unknown error",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const quickChips = [
        "cinematic",
        "slow motion",
        "time lapse",
        "macro",
        "vibrant colors",
        "soft lighting",
        "high contrast",
        "ultra-detailed",
    ];

    const downloadVideo = (url: string) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = `grok-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppShell>
            <Seo
                title="Imagine Studio — Video Generator"
                description="Grok Imagine-style video generator. Create AI videos from text prompts with customizable duration and aspect ratios."
            />

            <TopBar
                title={
                    <span>
                        Generate{" "}
                        <span className="text-gradient">videos</span> with AI
                    </span>
                }
                subtitle={
                    <span>
                        Transform text into moving visuals. Choose model, duration, and aspect ratio for professional-quality AI videos.
                    </span>
                }
                right={
                    <div className="hidden md:flex items-center gap-2">
                        <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
                            {modelLabel}
                        </Badge>
                        <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
                            {duration}s
                        </Badge>
                        <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
                            {aspectRatio}
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
                                        <Video className="h-4 w-4 text-primary" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl">Video composer</h2>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Describe the scene, action, style, and camera movement. The more vivid, the better the result.
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
                                    placeholder="Describe the video you want to create..."
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
                                    Different models offer unique styles and capabilities.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground/90">
                                    Duration
                                </label>
                                <Select
                                    value={String(duration)}
                                    onValueChange={(v) => setDuration(Number(v))}
                                >
                                    <SelectTrigger
                                        data-testid="select-duration"
                                        className={cn(
                                            "mt-2 h-12 rounded-2xl",
                                            "bg-white/[0.03] border-white/10",
                                            "focus:ring-4 focus:ring-ring/20 focus:border-primary/40",
                                        )}
                                    >
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                                        {DURATIONS.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span>{d.label}</span>
                                                    <span className="text-xs text-muted-foreground">{d.hint}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Longer durations may take more time to generate.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground/90">
                                    Aspect Ratio
                                </label>
                                <Select
                                    value={aspectRatio}
                                    onValueChange={setAspectRatio}
                                >
                                    <SelectTrigger
                                        data-testid="select-aspect-ratio"
                                        className={cn(
                                            "mt-2 h-12 rounded-2xl",
                                            "bg-white/[0.03] border-white/10",
                                            "focus:ring-4 focus:ring-ring/20 focus:border-primary/40",
                                        )}
                                    >
                                        <SelectValue placeholder="Select aspect ratio" />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-card/95 backdrop-blur-xl">
                                        {ASPECT_RATIOS.map((ar) => (
                                            <SelectItem key={ar.id} value={ar.id}>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span>{ar.label}</span>
                                                    <span className="text-xs text-muted-foreground">{ar.hint}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Choose based on your intended platform and style.
                                </p>
                            </div>

                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    data-testid="button-generate"
                                    onClick={onGenerate}
                                    disabled={!prompt.trim() || isProcessing}
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
                                    {isProcessing || create.isPending ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Generating…
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            <Wand2 className="h-4 w-4" />
                                            Generate Video
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
                                            <Play className="h-4 w-4 text-primary" />
                                        </div>
                                        <h2 className="text-xl sm:text-2xl">Output</h2>
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Your generated video will appear here. Preview, download, and share your creation.
                                    </p>
                                </div>
                                {result?.status === "failed" ? (
                                    <Badge className="rounded-full bg-destructive/15 text-destructive border border-destructive/30">
                                        Failed
                                    </Badge>
                                ) : result?.status === "completed" ? (
                                    <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/90">
                                        Completed
                                    </Badge>
                                ) : result?.status === "processing" ? (
                                    <Badge className="rounded-full bg-primary/15 text-primary border border-primary/30">
                                        Processing
                                    </Badge>
                                ) : null}
                            </div>

                            <div className="mt-5">
                                {isProcessing || create.isPending ? (
                                    <div className="surface-glass rounded-3xl p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10">
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/25 to-accent/20 blur-lg opacity-70" />
                                                <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold">Generating video</div>
                                                <div className="text-xs text-muted-foreground">
                                                    This may take a few moments depending on the duration and model.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 grid grid-cols-1 gap-4">
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                <div className="flex items-center gap-3">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <div>
                                                        <div className="font-semibold">Estimated time</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {duration <= 5 ? "30-60 seconds" : duration <= 10 ? "1-2 minutes" : "2-4 minutes"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                                <div className="flex items-center gap-3">
                                                    <Monitor className="h-4 w-4 text-primary" />
                                                    <div>
                                                        <div className="font-semibold">Resolution</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {aspectRatioConfig.width}x{aspectRatioConfig.height}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : result?.status === "completed" && result.videoUrl ? (
                                    <div className="space-y-4">
                                        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
                                            <video
                                                src={result.videoUrl}
                                                controls
                                                className="w-full h-auto"
                                                poster={result.thumbnailUrl}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => downloadVideo(result.videoUrl)}
                                                className={cn(
                                                    "flex-1 rounded-2xl font-semibold",
                                                    "bg-gradient-to-r from-primary to-accent",
                                                    "text-primary-foreground shadow-[0_18px_55px_rgba(0,0,0,.55)]",
                                                    "hover:shadow-[0_22px_65px_rgba(0,0,0,.65)] hover:-translate-y-0.5",
                                                    "active:translate-y-0 active:shadow-[0_14px_40px_rgba(0,0,0,.55)]",
                                                    "transition-all duration-200 ease-out ring-focus",
                                                )}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Video
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(result.videoUrl, '_blank')}
                                                className="flex-1 rounded-2xl font-semibold border-white/20 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/30"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Full Screen
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                                <div className="font-semibold">Model</div>
                                                <div>{modelLabel}</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                                <div className="font-semibold">Duration</div>
                                                <div>{duration}s</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                                <div className="font-semibold">Resolution</div>
                                                <div>{aspectRatioConfig.width}x{aspectRatioConfig.height}</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                                <div className="font-semibold">Aspect Ratio</div>
                                                <div>{aspectRatio}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : result?.status === "failed" ? (
                                    <div className="surface-glass rounded-3xl p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-destructive/20 ring-1 ring-destructive/30">
                                                <Video className="h-4 w-4 text-destructive" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-destructive">Generation failed</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {result.error || "Something went wrong during video generation."}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <Button
                                                onClick={onGenerate}
                                                className={cn(
                                                    "flex-1 rounded-2xl font-semibold",
                                                    "bg-gradient-to-r from-primary to-accent",
                                                    "text-primary-foreground shadow-[0_18px_55px_rgba(0,0,0,.55)]",
                                                    "hover:shadow-[0_22px_65px_rgba(0,0,0,.65)] hover:-translate-y-0.5",
                                                    "active:translate-y-0 active:shadow-[0_14px_40px_rgba(0,0,0,.55)]",
                                                    "transition-all duration-200 ease-out ring-focus",
                                                )}
                                            >
                                                <Wand2 className="h-4 w-4 mr-2" />
                                                Try Again
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<Sparkles className="h-6 w-6 text-primary" />}
                                        title="No video yet"
                                        description="Write a prompt, choose your settings, and hit Generate. Your video will appear here with preview and download options."
                                    />
                                )}
                            </div>
                        </GlowCard>

                        <div className="surface-glass rounded-3xl p-5 sm:p-6">
                            <div className="text-sm font-semibold">Video creation checklist</div>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                {[
                                    "Scene: where and when does it take place?",
                                    "Action: what's happening in the video?",
                                    "Style: cinematic, animation, realistic?",
                                    "Camera: movement, angle, focus?",
                                    "Lighting: time of day, mood?",
                                    "Duration: how long should it be?",
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