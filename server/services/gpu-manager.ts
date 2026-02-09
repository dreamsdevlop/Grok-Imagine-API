import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export type GpuStatus = {
    available: boolean;
    totalMemory: number;
    usedMemory: number;
    freeMemory: number;
    utilization: number;
    status: "available" | "limited" | "unavailable";
};

export async function getGpuStatus(): Promise<GpuStatus> {
    try {
        // Try to run nvidia-smi to get GPU info
        const { stdout } = await execAsync("nvidia-smi --query-gpu=memory.total,memory.used,memory.free,utilization.gpu --format=csv,noheader,nounits");

        // Output format: 12288, 1000, 11288, 5
        const parts = stdout.trim().split("\n")[0].split(", ");
        const [total, used, free, util] = parts.map(val => parseInt(val, 10));

        return {
            available: true,
            totalMemory: total,
            usedMemory: used,
            freeMemory: free,
            utilization: util,
            status: free > 2000 ? "available" : "limited",
        };
    } catch (error) {
        // Falls back to unavailable if nvidia-smi fails
        return {
            available: false,
            totalMemory: 0,
            usedMemory: 0,
            freeMemory: 0,
            utilization: 0,
            status: "unavailable",
        };
    }
}
