import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import { Badge } from "@/components/ui/badge";
import { Wand2, Image as ImageIcon, Maximize, Scissors, Layers, Eraser, UserCircle, Type, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const TOOLS = [
    {
        title: "Upscale X",
        desc: "Transform low-res images into 4K/8K masterpieces with local GPU upscaling.",
        icon: Maximize,
        status: "Beta",
        color: "cyan",
    },
    {
        title: "Face Swap",
        desc: "Replace faces in any generation with cinematic consistency.",
        icon: UserCircle,
        status: "Upcoming",
        color: "purple",
    },
    {
        title: "Object Remover",
        desc: "Clean up distracting elements from your images with AI inpainting.",
        icon: Eraser,
        status: "Beta",
        color: "red",
    },
    {
        title: "Style Transfer",
        desc: "Apply the aesthetic of any reference image to your new generations.",
        icon: Layers,
        status: "Stable",
        color: "orange",
    },
    {
        title: "Background Engine",
        desc: "Instantly isolate subjects and generate new environments.",
        icon: Scissors,
        status: "Stable",
        color: "green",
    },
    {
        title: "Motion Studio",
        desc: "Animate static images into high-frame-rate video clips.",
        icon: PlayCircle,
        status: "Alpha",
        color: "pink",
    },
    {
        title: "Typography AI",
        desc: "Generate clean, stylised text within your image designs.",
        icon: Type,
        status: "Upcoming",
        color: "blue",
    },
    {
        title: "Prompt Enhancer",
        desc: "Thesaurus-driven prompt expansion for more artistic results.",
        icon: Sparkles,
        status: "Experimental",
        color: "yellow",
    }
];

export default function Tools() {
    return (
        <AppShell>
            <TopBar
                title={<span>AI <span className="text-gradient">Toolkit</span></span>}
                subtitle="Post-processing, restoration, and advanced generative tools for your creative pipeline."
            />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {TOOLS.map((tool, i) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={tool.title}
                        >
                            <GlowCard className="h-full p-6 flex flex-col border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                <div className={`w-12 h-12 rounded-xl bg-${tool.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <tool.icon className={`h-6 w-6 text-${tool.color}-400`} />
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                                    <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter border-${tool.color}-500/30 text-${tool.color}-400`}>
                                        {tool.status}
                                    </Badge>
                                </div>

                                <p className="text-xs text-white/40 leading-relaxed font-medium flex-grow">
                                    {tool.desc}
                                </p>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em]">Launch Tool</span>
                                    <div className="h-2 w-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                </div>
                            </GlowCard>
                        </motion.div>
                    ))}
                </div>

                <section className="mt-20">
                    <GlowCard className="p-10 border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-accent/10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">CUSTOM MODEL <span className="text-primary">TRAINING</span></h2>
                                <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">
                                    Train your own LoRA or Dreambooth models locally using your GPU. Capture specific characters, styles, or concepts with just 15-20 images.
                                </p>
                                <div className="flex gap-4">
                                    <button className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl shadow-white/10">
                                        Setup Trainer
                                    </button>
                                    <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                        Read Documentation
                                    </button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-video rounded-[32px] bg-black/60 border border-white/10 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-16 w-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center animate-pulse">
                                            <Wand2 className="h-8 w-8 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative bits */}
                                <div className="absolute -top-4 -right-4 h-24 w-24 bg-accent/20 blur-3xl rounded-full" />
                                <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-primary/20 blur-3xl rounded-full" />
                            </div>
                        </div>
                    </GlowCard>
                </section>
            </main>
        </AppShell>
    );
}
