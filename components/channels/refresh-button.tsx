"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { refreshChannel } from "@/app/actions/channels";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function RefreshButton({ channelId }: { channelId: string }) {
    const [loading, setLoading] = useState(false);

    const handleRefresh = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        try {
            const result = await refreshChannel(channelId);
            if (result.success) {
                toast.success("Channel refreshed");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to refresh channel");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading} className="h-8 w-8 hover:bg-slate-100">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
    );
}
