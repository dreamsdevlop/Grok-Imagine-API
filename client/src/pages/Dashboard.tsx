import { motion } from "framer-motion";
import { GPUStatus } from "@/components/GPUStatus";
import { Image, MessageSquare, Video, Wand2, Plus, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/AppShell";
import { Button } from "@/components/ui/button";

const CAPABILITIES = [
    {
        title: "Image Studio",
        desc: "Neural generation via FLUX, SD 3.5, and Grok Imagine.",
        icon: Image,
        href: "/generator",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
        title: "AI Chat",
        desc: "Multi-modal discourse with Gemini, Llama, and local models.",
        icon: MessageSquare,
        href: "/chat",
        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
        title: "Video Engine",
        desc: "Cinematic motion synthesis using Wan 2.2 and LTX-2.",
        icon: Video,
        href: "/video",
        color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    },
    {
        title: "AI Toolkit",
        desc: "Advanced restoration, upscaling, and restorative assets.",
        icon: Wand2,
        href: "/tools",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
];

export default function Dashboard() {
    return (
        <AppShell>
            <div className="max-w-7xl mx-auto px-6 py-20">
                <header className="mb-20 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-[0.85]"
                        >
                            STUDIO <span className="text-neutral-500">SYSTEMS</span>
                        </motion.h1>
                        <p className="text-neutral-500 text-lg lg:text-xl font-bold uppercase tracking-tight max-w-2xl">
                            Unified workspace for high-fidelity generation, professional inference nodes, and distributed creative assets.
                        </p>
                    </div>
                    <div className="w-full lg:w-96">
                        <GPUStatus />
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {CAPABILITIES.map((cap, i) => (
                        <Link key={cap.title} href={cap.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <div className="h-full group cursor-pointer border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 hover:border-neutral-700 transition-all duration-300 flex flex-col p-10 rounded-2xl shadow-sm">
                                    <div className={`w-14 h-14 rounded-2xl ${cap.color} border border-white/5 flex items-center justify-center mb-10 transition-transform group-hover:scale-105`}>
                                        <cap.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{cap.title}</h3>
                                    <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10 flex-grow">{cap.desc}</p>
                                    <div className="flex items-center text-[10px] font-black text-neutral-200 uppercase tracking-[0.3em] group-hover:gap-6 transition-all border-t border-neutral-800 pt-6">
                                        <span>Initialize Terminal</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <section>
                    <div className="flex items-center justify-between mb-12 pb-6 border-b border-neutral-800">
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Project History</h2>
                        </div>
                        <Button
                            className="rounded-xl h-11 px-8 font-black uppercase tracking-widest text-[10px] bg-neutral-100 hover:bg-white text-neutral-900"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Create Entry
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="col-span-1 border-2 border-dashed border-neutral-800 rounded-2xl flex items-center justify-center p-24 text-center group cursor-pointer hover:bg-neutral-900/50 transition-all duration-300">
                            <div>
                                <div className="w-20 h-20 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto mb-8 group-hover:bg-neutral-700 transition-all">
                                    <Plus className="h-10 w-10 text-neutral-500 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-neutral-600 font-black uppercase tracking-[0.4em] text-[10px]">Matrix Initialization</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </AppShell>
    );
}
