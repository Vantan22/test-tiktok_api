"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { TikTokUserData } from "@/lib/tiktok-api";
import { useState } from "react";
import { addChannel } from "@/app/actions/channels";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";

interface SearchResultsProps {
    results: TikTokUserData[];
}

export function SearchResults({ results }: SearchResultsProps) {
    const [adding, setAdding] = useState<string | null>(null);
    const router = useRouter();

    const handleAdd = async (username: string) => {
        setAdding(username);
        try {
            const res = await addChannel({ username });
            if (res.success) {
                toast.success(`Channel @${username} added`);
                router.refresh(); // Refresh server data
            } else {
                toast.error(res.error);
            }
        } catch (e) {
            toast.error("Failed to add channel");
        } finally {
            setAdding(null);
        }
    };

    if (results.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((user) => (
                <div key={user.username} className="flex items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{user.displayName}</h4>
                        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatNumber(user.followerCount)} followers</p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={adding === user.username}
                        onClick={() => handleAdd(user.username)}
                    >
                        {adding === user.username ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            ))}
        </div>
    );
}
