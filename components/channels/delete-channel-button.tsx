"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteChannel } from "@/app/actions/channels";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteChannelButton({ channelId }: { channelId: string }) {
    const router = useRouter();
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this channel? This action cannot be undone.")) return;
        try {
            const res = await deleteChannel(channelId);
            if (res.success) {
                toast.success("Channel deleted");
                router.push("/channels");
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Failed to delete channel");
        }
    };
    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}
