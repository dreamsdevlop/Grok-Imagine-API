import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Badge } from "./ui/badge";

interface ModelSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    type?: "text" | "image" | "video";
}

export function ModelSelector({ value, onValueChange, type = "text" }: ModelSelectorProps) {
    const { data: status } = useQuery<{ ollama?: { connected: boolean } }>({
        queryKey: [api.status.providers.path],
        refetchInterval: 30000,
    });

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full bg-neutral-900 border-neutral-800 text-white rounded-lg h-12 hover:bg-neutral-800 transition-colors">
                <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800 text-white max-h-[400px]">
                {type === "text" && (
                    <>
                        <SelectGroup>
                            <SelectLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-3 font-bold flex items-center justify-between">
                                <span>Free Tier APIs</span>
                                <Badge variant="outline" className="text-[9px] border-emerald-500/50 text-emerald-400 py-0 h-4 uppercase bg-emerald-500/10">Active</Badge>
                            </SelectLabel>

                            <SelectItem value="google/gemini-2.0-flash-exp:free" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Gemini 2.0 Flash</span>
                                        <span className="text-[9px] text-neutral-500">Google • High Speed</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4 uppercase">Free</Badge>
                                </div>
                            </SelectItem>

                            <SelectItem value="groq/llama-3.1-70b-versatile" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Llama 3.1 (70B)</span>
                                        <span className="text-[9px] text-neutral-500">Groq • Low Latency</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4 uppercase">Free</Badge>
                                </div>
                            </SelectItem>

                            <SelectItem value="grok-2-mini" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Grok 2 Mini</span>
                                        <span className="text-[9px] text-neutral-500">xAI via RapidAPI</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4 uppercase">Free</Badge>
                                </div>
                            </SelectItem>

                            <SelectItem value="together/meta-llama/Llama-3.1-8B-Instruct-Turbo" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Llama 3.1 (8B)</span>
                                        <span className="text-[9px] text-neutral-500">Together AI • Efficient</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4 uppercase">Free</Badge>
                                </div>
                            </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="mt-2">
                            <SelectLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-3 font-bold flex items-center justify-between border-t border-neutral-800 pt-4 mt-2">
                                <span>Local Inference</span>
                                <div className="flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${status?.ollama?.connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className={`text-[9px] ${status?.ollama?.connected ? 'text-emerald-400' : 'text-red-500'} lowercase`}>
                                        {status?.ollama?.connected ? 'Connected' : 'Offline'}
                                    </span>
                                </div>
                            </SelectLabel>
                            <SelectItem value="qwen2.5:0.5b" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Qwen 2.5 (0.5B)</span>
                                        <span className="text-[9px] text-neutral-500">Privacy focused • Offline</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-blue-500/30 text-blue-400 py-0 h-4">Local</Badge>
                                </div>
                            </SelectItem>
                        </SelectGroup>

                        <SelectGroup className="mt-2 pb-2">
                            <SelectLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-3 font-bold border-t border-neutral-800 pt-4 mt-2">Premium Engines</SelectLabel>
                            <SelectItem value="grok-2" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs">Grok-2</span>
                                        <span className="text-[9px] text-neutral-500">Advanced Reasoning</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] border-neutral-700 text-neutral-400 py-0 h-4 uppercase">Paid</Badge>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </>
                )}

                {/* Image and Video groups with similar aesthetic refinement */}
                {type === "image" && (
                    <>
                        <SelectGroup>
                            <SelectLabel className="text-neutral-500 text-[10px] uppercase tracking-widest px-2 py-3 font-bold">Free Generators</SelectLabel>
                            <SelectItem value="stabilityai/stable-diffusion-3.5-large" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <span className="font-bold text-xs">SD 3.5 Large</span>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4">Free</Badge>
                                </div>
                            </SelectItem>
                            <SelectItem value="black-forest-labs/flux.1-schnell" className="focus:bg-neutral-800 cursor-pointer">
                                <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                    <span className="font-bold text-xs">FLUX.1 Schnell</span>
                                    <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400 py-0 h-4">Free</Badge>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </>
                )}
            </SelectContent>
        </Select>
    );
}
