import { useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Calendar, Settings2, ArrowUpRight, Search, LayoutGrid, List as ListIcon } from "lucide-react";
import { useProjects, useCreateProject } from "@/hooks/use-studio";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
    const { data: projects, isLoading } = useProjects();
    const create = useCreateProject();
    const { toast } = useToast();
    const [showNew, setShowNew] = useState(false);
    const [name, setName] = useState("");
    const [view, setView] = useState<"grid" | "list">("grid");

    const onCreate = async () => {
        if (!name.trim()) return;
        try {
            await create.mutateAsync({ name });
            setName("");
            setShowNew(false);
            toast({ title: "Project Created", description: `${name} is ready.` });
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        }
    };

    return (
        <AppShell>
            <TopBar
                title={<span>Studio <span className="text-gradient">Projects</span></span>}
                subtitle="Organize your generations, artboards, and creative workflows into structured projects."
            />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex items-center justify-between mb-8">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-10 h-10 bg-black/40 border-white/5 rounded-xl text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 mx-2">
                            <button
                                onClick={() => setView("grid")}
                                aria-label="Grid View"
                                className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60'}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setView("list")}
                                aria-label="List View"
                                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60'}`}
                            >
                                <ListIcon className="h-4 w-4" />
                            </button>
                        </div>
                        <Button
                            onClick={() => setShowNew(true)}
                            className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-4 h-10 gap-2 shadow-lg shadow-primary/20"
                        >
                            <Plus className="h-4 w-4" /> New Project
                        </Button>
                    </div>
                </div>

                {showNew && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 p-6 rounded-3xl bg-white/5 border border-primary/20 shadow-2xl backdrop-blur-xl"
                    >
                        <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs opacity-50">Create Workspace</h3>
                        <div className="flex gap-4">
                            <Input
                                autoFocus
                                placeholder="Environment Name (e.g. Cyberpunk Noir, UI Concepts)"
                                className="bg-black/40 border-white/10 h-12 rounded-2xl flex-1"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onCreate()}
                            />
                            <Button
                                onClick={onCreate}
                                disabled={create.isPending}
                                className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                            >
                                {create.isPending ? "Creating..." : "Initialize"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowNew(false)}
                                className="h-12 px-6 rounded-2xl text-white/40 hover:text-white/80"
                            >
                                Cancel
                            </Button>
                        </div>
                    </motion.div>
                )}

                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
                        ))
                    ) : projects?.length === 0 ? (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                <FolderOpen className="h-10 w-10 text-white/10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Ocean of emptiness</h3>
                            <p className="text-white/30 text-sm max-w-xs mx-auto">
                                No projects found. Launch a new creative workspace to start organizing your AI assets.
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => setShowNew(true)}
                                className="mt-6 text-primary hover:text-primary/80 font-bold uppercase tracking-widest text-[10px] underline underline-offset-4"
                            >
                                Create Workspace Now
                            </Button>
                        </div>
                    ) : projects?.map((p: any, i: number) => (
                        <Link key={p.id} href={`/projects/${p.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlowCard className="p-6 border-white/5 group hover:border-primary/30 transition-all duration-500 cursor-pointer">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                            <FolderOpen className="h-6 w-6 text-primary" />
                                        </div>
                                        <button
                                            aria-label="Project Settings"
                                            className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white/60 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-xs text-white/30 line-clamp-2 mb-6 font-medium">
                                        {p.description || "Experimental creative workspace for multi-modal generation."}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase font-black text-white/20 tracking-tighter">Created</span>
                                                <span className="text-[10px] font-bold text-white/60">{new Date(p.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="w-px h-6 bg-white/5" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] uppercase font-black text-white/20 tracking-tighter">Assets</span>
                                                <span className="text-[10px] font-bold text-white/60">{p.assetCount || 0} items</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                            <ArrowUpRight className="h-4 w-4 text-white/40" />
                                        </div>
                                    </div>
                                </GlowCard>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main>
        </AppShell>
    );
}
