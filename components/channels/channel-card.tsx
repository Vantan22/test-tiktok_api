import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react";
import { formatNumber, formatTimeAgo, cn } from "@/lib/utils";
import { Channel } from "@/types/channel";
import { RefreshButton } from "./refresh-button";

interface ChannelCardProps {
    channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
    // Mock growth for now, ideally derived from history
    const growth = 0; // Requires history comparison passed in prop

    // Interactive refresh button inside a Link needs care. 
    // RefreshButton handles stopPropagation.

    return (
        <Link href={`/channels/${channel.username}`}>
            <Card className="hover:shadow-md transition-shadow relative group">
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshButton channelId={channel._id} />
                </div>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="relative">
                            <Avatar className="h-14 w-14 border border-gray-100">
                                <AvatarImage src={channel.avatarUrl} alt={channel.username} />
                                <AvatarFallback>{channel.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {channel.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                    <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-500 text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-bold text-lg truncate pr-8">{channel.displayName}</h3>
                        <p className="text-sm text-gray-500">@{channel.username}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Followers</p>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-lg">{formatNumber(channel.followerCount)}</span>
                                {/* Growth badge placeholder */}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Engagement</p>
                            <div className="flex items-center gap-1">
                                <span className={cn(
                                    "font-bold text-lg",
                                    channel.engagementRate > 5 ? "text-green-600" :
                                        channel.engagementRate >= 2 ? "text-yellow-600" : "text-gray-600"
                                )}>
                                    {channel.engagementRate.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                            {channel.groupName && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {channel.groupName}
                                </Badge>
                            )}
                        </div>
                        <span className="text-xs text-gray-400">
                            Upd {formatTimeAgo(channel.lastFetchedAt)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
