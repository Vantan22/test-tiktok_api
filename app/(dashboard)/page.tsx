import { getOverviewStats, getTopChannels } from "@/app/actions/analytics";
import { StatsCard } from "@/components/analytics/stats-card";
import { ChannelCard } from "@/components/channels/channel-card";
import { Users, TrendingUp, Target, Calendar } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Channel } from "@/types/channel";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const stats = await getOverviewStats();
    const topChannels = await getTopChannels(5);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your TikTok channels</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Channels"
                    value={stats.totalChannels}
                    icon={Users}
                    description="Tracked channels"
                />
                <StatsCard
                    title="Total Followers"
                    value={formatNumber(stats.totalFollowers)}
                    icon={TrendingUp}
                    description="Across all channels"
                />
                <StatsCard
                    title="Avg. Engagement"
                    value={`${stats.avgEngagement}%`}
                    icon={Target}
                    description="Average rate"
                />
                <StatsCard
                    title="New This Week"
                    value={stats.newChannelsCount}
                    icon={Calendar}
                    description="Channels added"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Top Channels</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {topChannels.map((channel: any) => (
                        <ChannelCard key={channel._id} channel={channel} />
                    ))}
                    {topChannels.length === 0 && (
                        <div className="col-span-full p-8 text-center border rounded-lg border-dashed bg-slate-50 dark:bg-slate-900/50">
                            <p className="text-muted-foreground">No channels found yet. Go to Search to add channels.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
