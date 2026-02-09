import { useState } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import { FreeQuotaStatus } from "@/components/FreeQuotaStatus";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { Switch } from "@/components/ui/switch";
import { Server, Cpu, BarChart3, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
    const [classicMode, setClassicMode] = useState(true);

    return (
        <AppShell>
            <TopBar
                title={<span className="font-black text-white">STUDIO <span className="text-neutral-500">SYSTEMS</span></span>}
                subtitle="Configure cloud providers, quota monitoring, and system environment parameters."
            />

            <main className="max-w-5xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-12">
                        {/* API Keys */}
                        <section>
                            <ApiKeyManager />
                        </section>

                        {/* Local Configuration */}
                        <section className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-neutral-800 rounded-lg">
                                    <Server className="h-5 w-5 text-neutral-400" />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Local Inference</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Ollama Node</label>
                                        <Input value="http://localhost:11434" className="bg-neutral-800 border-neutral-700 h-11 text-blue-400 rounded-xl font-mono text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">VRAM Allocation</label>
                                        <Input placeholder="Current: AUTO" className="bg-neutral-800 border-neutral-700 h-11 rounded-xl text-xs" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-5 rounded-xl bg-neutral-950/50 border border-neutral-800">
                                    <div>
                                        <p className="text-xs font-black text-neutral-200 uppercase tracking-tight">FP16 Precise Quantization</p>
                                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1 text-muted-foreground">Optimize for high-accuracy inference</p>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        {/* Quota Monitoring */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="h-4 w-4 text-emerald-400" />
                                <h2 className="text-xs font-black text-neutral-500 uppercase tracking-widest">Real-time Metrics</h2>
                            </div>
                            <FreeQuotaStatus />
                        </section>

                        {/* Appearance Switch */}
                        <section className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-neutral-200 uppercase tracking-tight">Classic Theme</p>
                                    <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Professional neutral look</p>
                                </div>
                                <Switch checked={classicMode} onCheckedChange={setClassicMode} />
                            </div>
                        </section>

                        {/* System Summary */}
                        <section className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 space-y-4">
                            <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-widest border-b border-neutral-800 pb-2 mb-4">Environment</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Platform</span>
                                    <span className="text-[10px] text-neutral-300 font-bold uppercase">Windows 11</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Datastore</span>
                                    <span className="text-[10px] text-neutral-300 font-bold uppercase">PostgreSQL</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Engine</span>
                                    <span className="text-[10px] text-neutral-300 font-bold uppercase">v20.x</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="mt-12 pt-8 border-t border-neutral-800 flex justify-between items-center">
                    <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">v2.4.0 • Enterprise Edition</p>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-neutral-300">Restore</Button>
                        <Button className="bg-neutral-100 hover:bg-white text-neutral-900 font-black text-[10px] h-10 px-8 rounded-xl uppercase tracking-widest transition-all">
                            Save Configuration
                        </Button>
                    </div>
                </footer>
            </main>
        </AppShell>
    );
}
