import { Video } from "@/types/video";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber, formatTimeAgo } from "@/lib/utils";
import { Play, Heart, MessageCircle, Share2 } from "lucide-react";

export function VideoCard({ video }: { video: Video }) {
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
            <div className="aspect-[9/16] relative bg-slate-100 dark:bg-slate-800">
                {video.thumbnailUrl ? (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.description}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Play className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-100">
                    <div className="flex items-center gap-3 text-xs font-medium">
                        <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {formatNumber(video.viewCount)}</span>
                    </div>
                </div>
            </div>
            <CardContent className="p-3">
                <p className="text-sm line-clamp-2 mb-3 h-10">{video.description || "No description"}</p>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {formatNumber(video.likeCount)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {formatNumber(video.commentCount)}</span>
                    </div>
                    <span>{video.publishedAt ? formatTimeAgo(video.publishedAt) : ""}</span>
                </div>
            </CardContent>
        </Card>
    );
}
