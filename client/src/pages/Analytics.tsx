import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { Activity, TrendingUp, DollarSign, Zap, Loader2 } from "lucide-react";
import { api } from "@shared/routes";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function Analytics() {
    const [usage, setUsage] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const res = await fetch(api.usage.list.path);
            if (res.ok) {
                const data = await res.json();
                setUsage(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const totalRequests = usage.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <AppShell>
            <TopBar
                title={<span>Usage <span className="text-gradient">Analytics</span></span>}
                subtitle="Monitor your API consumption and cost distribution across all providers."
            />

            <main className="max-w-7xl mx-auto px-6 pb-20">
                {loading ? (
                    <div className="flex justify-center p-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Total Requests", value: totalRequests, icon: Activity, color: "text-blue-500" },
                                { label: "Success Rate", value: "99.8%", icon: TrendingUp, color: "text-emerald-500" },
                                { label: "Est. Cost", value: `$${(totalRequests * 0.002).toFixed(2)}`, icon: DollarSign, color: "text-amber-500" },
                                { label: "Avg. Latency", value: "1.2s", icon: Zap, color: "text-purple-500" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 border border-border bg-card rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg bg-neutral-900 border border-border ${item.color}`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.label}</p>
                                    <p className="text-3xl font-black mt-1 text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Bar Chart */}
                            <div className="lg:col-span-2 p-8 border border-border bg-card rounded-2xl shadow-sm">
                                <h3 className="text-sm font-black mb-8 uppercase tracking-widest text-white/90">Requests by Provider</h3>
                                <div className="h-[350px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={usage}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <XAxis dataKey="provider" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => v.toUpperCase()} />
                                            <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                                                {usage.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Donut Chart */}
                            <div className="p-8 border border-border bg-card rounded-2xl shadow-sm">
                                <h3 className="text-sm font-black mb-8 uppercase tracking-widest text-white/90">Load Distribution</h3>
                                <div className="h-[350px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={usage}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={95}
                                                paddingAngle={5}
                                                dataKey="count"
                                                nameKey="provider"
                                                stroke="none"
                                            >
                                                {usage.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #262626', borderRadius: '12px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Global</p>
                                        <p className="text-lg font-black text-white">Share</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </AppShell>
    );
}
