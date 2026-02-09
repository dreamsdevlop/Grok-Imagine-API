import { useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModels, usePullModel, useProviderStatus } from "@/hooks/use-studio";
import { Box, Download, Search, HardDrive, Cpu, Cloud, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const RECOMMENDED_MODELS = [
    { name: "llama3.2:3b", size: "2.0GB", desc: "Meta's lightweight powerful LLM" },
    { name: "mistral:7b", size: "4.1GB", desc: "Balanced performance/size model" },
    { name: "phi3:3.5b", size: "2.3GB", desc: "Microsoft's high-capability small model" },
    { name: "deepseek-coder:6.7b", size: "4.0GB", desc: "Optimized for programming tasks" },
    { name: "stable-diffusion:latest", size: "5.2GB", desc: "Local image generation engine" },
];

export default function Models() {
    const { data: localModels, isLoading } = useModels();
    const { data: status } = useProviderStatus();
    const pull = usePullModel();
    const { toast } = useToast();
    const [search, setSearch] = useState("");

    const onPull = async (name: string) => {
        try {
            toast({ title: "Starting Download", description: `Pulling ${name}... check back in a few minutes.` });
            await pull.mutateAsync(name);
            toast({ title: "Success", description: `${name} has been added to your local library.` });
        } catch (e: any) {
            toast({ title: "Download Failed", description: e.message, variant: "destructive" });
        }
    };

    const filteredLocal = localModels?.filter((m: any) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <AppShell>
            <TopBar
                title={<span>Model <span className="text-gradient">Marketplace</span></span>}
                subtitle="Manage local AI assets, pull new weights, and monitor provider connectivity."
            />

            <main className="max-w-7xl mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    <div className="space-y-8">
                        {/* Search and Filter */}
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                <Input
                                    placeholder="Search local or cloud models..."
                                    className="pl-11 h-12 bg-black/40 border-white/10 rounded-2xl"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
                                Filters
                            </Button>
                        </div>

                        {/* Local Library */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <HardDrive className="h-5 w-5 text-cyan-400" />
                                <h2 className="text-xl font-bold text-white">Local Library</h2>
                                <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                    {filteredLocal.length} Models
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {isLoading ? (
                                        Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />
                                        ))
                                    ) : filteredLocal.map((m: any) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={m.name}
                                        >
                                            <GlowCard className="p-5 border-white/5 group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                                            <Box className="h-5 w-5 text-cyan-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-bold leading-none">{m.name}</h3>
                                                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1 font-bold">
                                                                {Math.round(m.size / 1024 / 1024 / 1024 * 10) / 10} GB • Local
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        aria-label="Delete Model"
                                                        className="p-2 rounded-lg bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-green-500/10 text-green-400 border-none text-[9px] uppercase">Ready</Badge>
                                                    <Badge className="bg-white/5 text-white/40 border-none text-[9px] uppercase">Ollama</Badge>
                                                </div>
                                            </GlowCard>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* Marketplace Recommendations */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Cloud className="h-5 w-5 text-purple-400" />
                                <h2 className="text-xl font-bold text-white">Recommended Weights</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {RECOMMENDED_MODELS.map((m) => (
                                    <GlowCard key={m.name} className="p-5 border-white/5 group hover:border-white/20 transition-all">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Download className="h-5 w-5 text-white/40 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">{m.name}</h3>
                                                    <p className="text-xs text-white/40">{m.desc}</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => onPull(m.name)}
                                                className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
                                                disabled={pull.isPending}
                                            >
                                                {pull.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pull"}
                                            </Button>
                                        </div>
                                    </GlowCard>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Status */}
                    <div className="space-y-6">
                        <GlowCard className="p-6 border-white/5 bg-white/[0.02]">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-primary" /> System Status
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/50">Ollama Instance</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase ${status?.ollama?.connected ? 'text-green-400' : 'text-red-400'}`}>
                                            {status?.ollama?.connected ? 'Connected' : 'Offline'}
                                        </span>
                                        <div className={`h-2 w-2 rounded-full ${status?.ollama?.connected ? 'bg-green-400' : 'bg-red-400'}`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/50">OpenRouter API</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase text-green-400">Stable</span>
                                        <div className="h-2 w-2 rounded-full bg-green-400" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/50">HuggingFace API</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase text-green-400">Stable</span>
                                        <div className="h-2 w-2 rounded-full bg-green-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Pro Tip</p>
                                    <p className="text-xs text-white/60 leading-relaxed">
                                        Local models use your GPU VRAM. Ensure you have enough memory before pulling larger ({">"}7B) models.
                                    </p>
                                </div>
                            </div>
                        </GlowCard>
                    </div>
                </div>
            </main>
        </AppShell>
    );
}
