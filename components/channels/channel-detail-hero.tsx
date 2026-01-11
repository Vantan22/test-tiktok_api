import { Channel } from "@/types/channel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { RefreshButton } from "./refresh-button";
import { DeleteChannelButton } from "./delete-channel-button";

export function ChannelDetailHero({ channel }: { channel: Channel }) {
    return (
        <div className="flex flex-col md:flex-row gap-6 items-start bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg shrink-0">
                <AvatarImage src={channel.avatarUrl} className="object-cover" />
                <AvatarFallback className="text-3xl">{channel.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4 w-full">
                <div className="flex items-start justify-between w-full">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            {channel.displayName}
                            {channel.verified && <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-500 text-white" />}
                        </h1>
                        <p className="text-muted-foreground text-lg">@{channel.username}</p>
                    </div>
                    <div className="flex gap-2">
                        <RefreshButton channelId={channel._id} />
                        <DeleteChannelButton channelId={channel._id} />
                    </div>
                </div>

                {channel.bio && <p className="max-w-2xl text-sm md:text-base">{channel.bio}</p>}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-y py-4 my-4 w-full">
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold">{formatNumber(channel.followerCount)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold">{formatNumber(channel.followingCount)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Following</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold">{formatNumber(channel.totalLikes)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Likes</div>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="text-2xl font-bold">{formatNumber(channel.videoCount)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Videos</div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {channel.groupName && <Badge variant="secondary">{channel.groupName}</Badge>}
                    {channel.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                </div>
            </div>
        </div>
    );
}
