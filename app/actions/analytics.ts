"use server";

import { connectDB } from "@/lib/mongodb";
import { Channel } from "@/lib/models/Channel";
import { ChannelHistory } from "@/lib/models/ChannelHistory";

export async function getOverviewStats() {
    await connectDB();
    const totalChannels = await Channel.countDocuments();

    const channels = await Channel.find().select("followerCount engagementRate").lean();
    const totalFollowers = channels.reduce((acc, curr) => acc + (curr.followerCount || 0), 0);

    const avgEngagement = channels.length > 0
        ? channels.reduce((acc, curr) => acc + (curr.engagementRate || 0), 0) / channels.length
        : 0;

    // Channels added this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newChannelsCount = await Channel.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    return {
        totalChannels,
        totalFollowers,
        avgEngagement: Number(avgEngagement.toFixed(2)),
        newChannelsCount,
    };
}

export async function getChannelHistory(channelId: string, days: number = 30) {
    await connectDB();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await ChannelHistory.find({
        channelId,
        snapshotDate: { $gte: startDate },
    })
        .sort({ snapshotDate: 1 })
        .lean();

    return JSON.parse(JSON.stringify(history));
}

export async function getTopChannels(limit: number = 5, sortBy: "followers" | "engagement" = "followers") {
    await connectDB();
    const sortField = sortBy === "followers" ? "followerCount" : "engagementRate";

    const channels = await Channel.find()
        .sort({ [sortField]: -1 })
        .limit(limit)
        .lean();

    return JSON.parse(JSON.stringify(channels));
}

export async function compareChannels(channelIds: string[]) {
    await connectDB();

    const channels = await Channel.find({ _id: { $in: channelIds } }).lean();

    // Also fetch recent history for growth calculation if needed
    // For now just returning channel details

    return JSON.parse(JSON.stringify(channels));
}

export async function getRecentActivity(limit: number = 10) {
    await connectDB();
    const history = await ChannelHistory.find()
        .sort({ snapshotDate: -1 })
        .limit(limit)
        .populate("channelId", "username displayName avatarUrl")
        .lean();

    return JSON.parse(JSON.stringify(history));
}
