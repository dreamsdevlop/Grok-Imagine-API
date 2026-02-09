import { useQuery } from "@tanstack/react-query";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { api } from "@shared/routes";
import { Info } from "lucide-react";

export function FreeQuotaStatus() {
    const { data: usage, isLoading } = useQuery<Array<{ provider: string; count: number; limit: number }>>({
        queryKey: ["/api/usage/list"],
        refetchInterval: 60000,
    });

    if (isLoading || !usage) return null;

    return (
        <div className="space-y-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Free Tier Quotas</h3>
                <Info className="h-3 w-3 text-neutral-600" />
            </div>

            <div className="space-y-3">
                {usage.map((u: any) => {
                    const percent = Math.min((u.count / u.limit) * 100, 100);
                    const isHigh = percent > 80;

                    return (
                        <div key={u.provider} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-neutral-300">{u.provider}</span>
                                <span className={isHigh ? "text-red-400" : "text-emerald-400"}>
                                    {u.count} / {u.limit}
                                </span>
                            </div>
                            <Progress
                                value={percent}
                                className={`h-1 bg-neutral-800 ${isHigh ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"}`}
                            />
                        </div>
                    );
                })}
            </div>

            <p className="text-[9px] text-neutral-500 font-medium italic">
                Cloud quotas reset every 24 hours at UTC midnight.
            </p>
        </div>
    );
}
