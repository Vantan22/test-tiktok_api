"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RefreshCw, Trash2, MoreHorizontal } from "lucide-react";
import { Channel } from "@/types/channel";
import { formatNumber, formatTimeAgo, cn } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { deleteChannel } from "@/app/actions/channels"; // Needs delete button logic? Prompt said delete-channel-button.tsx
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// I'll inline delete logic or create delete button later. I'll use inline for now.
const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this channel?")) return;
    try {
        const result = await deleteChannel(id);
        if (result.success) {
            toast.success("Channel deleted");
        } else {
            toast.error(result.error);
        }
    } catch (e) {
        toast.error("Failed to delete channel");
    }
}

export function ChannelList({ channels }: { channels: Channel[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Channel</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead>Following</TableHead>
                        <TableHead>Likes</TableHead>
                        <TableHead>Videos</TableHead>
                        <TableHead>Engagement</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {channels.map((channel) => (
                        <TableRow key={channel._id}>
                            <TableCell>
                                <Link href={`/channels/${channel.username}`} className="flex items-center gap-3 hover:underline">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={channel.avatarUrl} alt={channel.username} />
                                        <AvatarFallback>{channel.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{channel.displayName}</span>
                                        <span className="text-xs text-muted-foreground">@{channel.username}</span>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>{formatNumber(channel.followerCount)}</TableCell>
                            <TableCell>{formatNumber(channel.followingCount)}</TableCell>
                            <TableCell>{formatNumber(channel.totalLikes)}</TableCell>
                            <TableCell>{formatNumber(channel.videoCount)}</TableCell>
                            <TableCell>
                                <span className={cn(
                                    channel.engagementRate > 5 ? "text-green-600" :
                                        channel.engagementRate >= 2 ? "text-yellow-600" : "text-gray-600"
                                )}>
                                    {channel.engagementRate.toFixed(2)}%
                                </span>
                            </TableCell>
                            <TableCell>
                                {channel.groupName && <Badge variant="outline">{channel.groupName}</Badge>}
                            </TableCell>
                            <TableCell className="text-zinc-500 text-xs">
                                {formatTimeAgo(channel.lastFetchedAt)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-2">
                                    <RefreshButton channelId={channel._id} />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(channel.username)}>
                                                Copy username
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={`/channels/${channel.username}`}>View details</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(channel._id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {channels.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                                No channels found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
