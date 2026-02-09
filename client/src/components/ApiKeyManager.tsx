import { useState, useEffect } from "react";
import GlowCard from "./GlowCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Key, Shield, AlertCircle, Loader2, Trash2, CheckCircle2 } from "lucide-react";
import { api, buildUrl } from "@shared/routes";
import { Badge } from "@/components/ui/badge";

const PROVIDERS = [
    { id: "google", name: "Google AI Studio (Gemini)" },
    { id: "anthropic", name: "Anthropic (Claude)" },
    { id: "groq", name: "Groq (LPU)" },
    { id: "openrouter", name: "OpenRouter" },
    { id: "cohere", name: "Cohere" },
    { id: "together", name: "Together AI" },
    { id: "huggingface", name: "Hugging Face" },
    { id: "replicate", name: "Replicate" },
];

export function ApiKeyManager() {
    const [keys, setKeys] = useState<{ provider: string; createdAt: string; isFreeKey?: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [provider, setProvider] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [isFree, setIsFree] = useState("true");
    const { toast } = useToast();

    const fetchKeys = async () => {
        try {
            const res = await fetch(api.keys.list.path);
            if (res.ok) {
                const data = await res.json();
                setKeys(data);
            }
        } catch (err) {
            console.error("Failed to fetch keys", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provider || !apiKey) return;

        setSaving(true);
        try {
            const res = await fetch(api.keys.save.path, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider, key: apiKey, isFreeKey: isFree }),
            });

            if (res.ok) {
                toast({
                    title: "Key Secured",
                    description: `${isFree === "true" ? "Free" : "Paid"} api key for ${provider} has been encrypted.`,
                });
                setApiKey("");
                fetchKeys();
            } else {
                throw new Error("Failed to save key");
            }
        } catch (err: any) {
            toast({
                title: "Security Event",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (providerToDelete: string) => {
        try {
            const res = await fetch(buildUrl(api.keys.delete.path, { provider: providerToDelete }), {
                method: "DELETE",
            });
            if (res.ok) {
                toast({ title: "Key Revoked", description: `Access disabled for ${providerToDelete}.` });
                fetchKeys();
            }
        } catch (err) {
            toast({ title: "Error", description: "Revocation failed", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700">
                        <Key className="h-6 w-6 text-neutral-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tighter text-white">API Core Management</h2>
                        <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Secure key vault for cloud inference</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="space-y-2 md:col-span-3">
                        <Label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest pl-1">Provider</Label>
                        <Select value={provider} onValueChange={setProvider}>
                            <SelectTrigger className="bg-neutral-800 border-neutral-700 h-11 rounded-xl text-neutral-200">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800">
                                {PROVIDERS.map((p) => (
                                    <SelectItem key={p.id} value={p.id} className="focus:bg-neutral-800">
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest pl-1">Tier</Label>
                        <Select value={isFree} onValueChange={setIsFree}>
                            <SelectTrigger className="bg-neutral-800 border-neutral-700 h-11 rounded-xl text-neutral-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800">
                                <SelectItem value="true" className="focus:bg-neutral-800">Free / Basic</SelectItem>
                                <SelectItem value="false" className="focus:bg-neutral-800">Paid / Pro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-5">
                        <Label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest pl-1">API Key Secret</Label>
                        <Input
                            type="password"
                            placeholder="Enter credentials..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="bg-neutral-800 border-neutral-700 h-11 rounded-xl font-mono text-xs focus:ring-emerald-500/20"
                        />
                    </div>

                    <Button type="submit" className="md:col-span-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest transition-all" disabled={saving || !provider || !apiKey}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                        Add Key
                    </Button>
                </form>

                <div className="mt-12">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6 border-b border-neutral-800 pb-2">Active Credentials</h3>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-neutral-700" />
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
                            <AlertCircle className="h-8 w-8 text-neutral-800 mb-3" />
                            <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">No keys in vault</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {keys.map((k) => (
                                <div key={k.provider} className="flex items-center justify-between p-4 rounded-xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${k.isFreeKey === "true" ? "bg-emerald-500/10" : "bg-purple-500/10"}`}>
                                            <CheckCircle2 className={`h-4 w-4 ${k.isFreeKey === "true" ? "text-emerald-500" : "text-purple-500"}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-xs uppercase text-neutral-200">{PROVIDERS.find(p => p.id === k.provider)?.name || k.provider}</p>
                                                <Badge variant="outline" className={`text-[8px] h-3.5 ${k.isFreeKey === "true" ? "border-emerald-500/30 text-emerald-500" : "border-purple-500/30 text-purple-500"} py-0 px-1 font-black uppercase`}>
                                                    {k.isFreeKey === "true" ? "Free" : "Premium"}
                                                </Badge>
                                            </div>
                                            <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">Updated {new Date(k.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg" onClick={() => handleDelete(k.provider)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
