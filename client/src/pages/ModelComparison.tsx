import { useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "@/components/ModelSelector";
import { Play, Columns, Layers, Loader2, MessageSquare, Clipboard } from "lucide-react";

export default function ModelComparison() {
    const [prompt, setPrompt] = useState("");
    const [modelA, setModelA] = useState("google/gemini-2.0-flash-exp:free");
    const [modelB, setModelB] = useState("anthropic/claude-3.5-sonnet:free");
    const [responseA, setResponseA] = useState("");
    const [responseB, setResponseB] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCompare = async () => {
        if (!prompt) return;
        setLoading(true);
        setResponseA("");
        setResponseB("");

        try {
            // Run in parallel
            const [resA, resB] = await Promise.all([
                fetch("/api/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: prompt, model: modelA }),
                }).then(r => r.json()),
                fetch("/api/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: prompt, model: modelB }),
                }).then(r => r.json())
            ]);

            setResponseA(resA.content || resA.message || "Error");
            setResponseB(resB.content || resB.message || "Error");
        } catch (e: any) {
            console.error(e);
            setResponseA("Error connecting to server");
            setResponseB("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <TopBar
                title={<span>Model <span className="text-gradient">Battleground</span></span>}
                subtitle="Side-by-side comparison of local and cloud models to evaluate performance and quality."
            />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="p-8 border border-border bg-card rounded-2xl shadow-sm mb-8">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-2 px-1">
                                Battle Prompt
                            </label>
                            <Textarea
                                placeholder="Enter a prompt to test across models..."
                                className="text-lg bg-neutral-900/50 border-border min-h-[120px] rounded-xl resize-none"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div className="flex gap-6 flex-1 w-full">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground block px-1">Competitor A</label>
                                    <ModelSelector value={modelA} onValueChange={setModelA} type="text" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground block px-1">Competitor B</label>
                                    <ModelSelector value={modelB} onValueChange={setModelB} type="text" />
                                </div>
                            </div>
                            <Button size="lg" className="px-10 h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] bg-primary hover:bg-primary/90 text-white w-full md:w-auto" onClick={handleCompare} disabled={loading || !prompt}>
                                {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                Initiate Battle
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
                    {/* Model A Results */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{modelA.split("/").pop()} Unit</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigator.clipboard.writeText(responseA)}>
                                <Clipboard className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-8 rounded-2xl border border-border bg-neutral-900/30 font-sans text-sm leading-relaxed text-white/90 overflow-y-auto min-h-[400px]">
                            {loading && !responseA ? (
                                <div className="h-full flex flex-col items-center justify-center text-primary/40 text-xs uppercase font-bold tracking-widest animate-pulse">
                                    Gathering intelligence...
                                </div>
                            ) : responseA ? (
                                <div className="whitespace-pre-wrap">{responseA}</div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                    <MessageSquare className="h-12 w-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting sector A</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Model B Results */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{modelB.split("/").pop()} Unit</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigator.clipboard.writeText(responseB)}>
                                <Clipboard className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 p-8 rounded-2xl border border-border bg-neutral-900/30 font-sans text-sm leading-relaxed text-white/90 overflow-y-auto min-h-[400px]">
                            {loading && !responseB ? (
                                <div className="h-full flex flex-col items-center justify-center text-purple-500/40 text-xs uppercase font-bold tracking-widest animate-pulse">
                                    Processing dataset...
                                </div>
                            ) : responseB ? (
                                <div className="whitespace-pre-wrap">{responseB}</div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                                    <MessageSquare className="h-12 w-12 mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting sector B</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </AppShell>
    );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={`block text-[10px] font-black uppercase tracking-widest text-muted-foreground ${className}`}>{children}</label>;
}
