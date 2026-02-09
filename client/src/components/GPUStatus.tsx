import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Cpu } from "lucide-react";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";

export function GPUStatus() {
    const { data: gpu, isLoading } = useQuery<{
        available: boolean;
        totalMemory: number;
        usedMemory: number;
        utilization: number;
    }>({
        queryKey: [api.status.gpu.path],
        refetchInterval: 5000,
    });

    if (isLoading || !gpu) return null;

    const usedPercent = gpu.totalMemory > 0
        ? (gpu.usedMemory / gpu.totalMemory) * 100
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Cpu className={`h-4 w-4 ${gpu.available ? 'text-emerald-500' : 'text-neutral-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-200">System Resources</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {gpu.available && (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">
                        {gpu.available ? 'Live' : 'offline'}
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-[9px] text-neutral-500 mb-2 uppercase tracking-widest font-black">
                        <span>VRAM Cluster</span>
                        <span className="text-neutral-300">
                            {gpu.totalMemory > 0
                                ? `${Math.round(gpu.usedMemory)}MB / ${Math.round(gpu.totalMemory)}MB`
                                : '0 / 0'}
                        </span>
                    </div>
                    <Progress
                        value={usedPercent}
                        className="h-1 bg-neutral-800"
                        indicatorClassName="bg-emerald-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-[9px] text-neutral-500 mb-2 uppercase tracking-widest font-black">
                        <span>Neural Load</span>
                        <span className="text-neutral-300">{gpu.utilization}%</span>
                    </div>
                    <Progress
                        value={gpu.utilization}
                        className="h-1 bg-neutral-800"
                        indicatorClassName="bg-neutral-100"
                    />
                </div>
            </div>
        </motion.div>
    );
}
