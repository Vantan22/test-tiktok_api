import { getChannel } from "@/app/actions/channels";
import { ChannelDetailHero } from "@/components/channels/channel-detail-hero";
import { VideoGrid } from "@/components/videos/video-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowersChart } from "@/components/analytics/followers-chart";
import { EngagementChart } from "@/components/analytics/engagement-chart";
import { HistoryTable } from "@/components/analytics/history-table";
import { notFound } from "next/navigation";
import { StatsCard } from "@/components/analytics/stats-card";
import { Eye, Heart, Activity, Video } from "lucide-react";

export default async function ChannelDetailPage({ params }: { params: { username: string } }) {
    const data = await getChannel(params.username);

    if (!data) {
        notFound();
    }

    const { channel, history, videos } = data;

    // Calculate some stats for Overview tab
    const avgViews = videos.length > 0
        ? videos.reduce((acc: number, curr: any) => acc + curr.viewCount, 0) / videos.length
        : 0;

    const avgLikes = videos.length > 0
        ? videos.reduce((acc: number, curr: any) => acc + curr.likeCount, 0) / videos.length
        : 0;

    const bestVideo = [...videos].sort((a: any, b: any) => b.viewCount - a.viewCount)[0];

    return (
        <div className="space-y-6">
            <ChannelDetailHero channel={channel} />

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Avg Views/Video"
                            value={Math.round(avgViews).toLocaleString()}
                            icon={Eye}
                        />
                        <StatsCard
                            title="Avg Likes/Video"
                            value={Math.round(avgLikes).toLocaleString()}
                            icon={Heart}
                        />
                        <StatsCard
                            title="Engagement Rate"
                            value={`${channel.engagementRate.toFixed(2)}%`}
                            icon={Activity}
                        />
                        <StatsCard
                            title="Total Videos"
                            value={channel.videoCount}
                            icon={Video}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <FollowersChart data={history} />
                        <EngagementChart data={history} />
                    </div>
                </TabsContent>

                <TabsContent value="videos" className="space-y-4">
                    <VideoGrid videos={videos} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FollowersChart data={history} />
                        <EngagementChart data={history} />
                    </div>
                    {/* Add more analytics here like Best Performing Video details */}
                    {bestVideo && (
                        <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                            <h3 className="font-semibold mb-2">Best Performing Video</h3>
                            <p>{bestVideo.description || "No description"}</p>
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{bestVideo.viewCount} views</span>
                                <span>{bestVideo.likeCount} likes</span>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history">
                    <HistoryTable history={history} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
