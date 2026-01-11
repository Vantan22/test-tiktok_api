"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Channel } from "@/lib/models/Channel";
import { ChannelHistory } from "@/lib/models/ChannelHistory";
import { Video } from "@/lib/models/Video";
import { fetchTikTokData } from "@/lib/tiktok-api";
import { addChannelSchema, updateChannelSchema } from "@/lib/validations";
import { z } from "zod";

function calculateEngagementRate(likes: number, videos: number, followers: number) {
    if (videos === 0 || followers === 0) return 0;
    return ((likes / videos) / followers) * 100;
}

export async function addChannel(data: z.infer<typeof addChannelSchema>) {
    try {
        await connectDB();

        const validatedFields = addChannelSchema.parse(data);
        const { username, groupName, tags, notes } = validatedFields;

        // Check if channel already exists
        const existingChannel = await Channel.findOne({ username });
        if (existingChannel) {
            throw new Error("Channel is already being tracked");
        }

        // Fetch data from TikTok API
        const tikTokData = await fetchTikTokData(username);

        // Calculate engagement
        const engagementRate = calculateEngagementRate(
            tikTokData.totalLikes,
            tikTokData.videoCount,
            tikTokData.followerCount
        );

        // Create channel
        const newChannel = await Channel.create({
            username: tikTokData.username,
            displayName: tikTokData.displayName,
            bio: tikTokData.bio,
            avatarUrl: tikTokData.avatarUrl,
            verified: tikTokData.verified,
            followerCount: tikTokData.followerCount,
            followingCount: tikTokData.followingCount,
            totalLikes: tikTokData.totalLikes,
            videoCount: tikTokData.videoCount,
            engagementRate,
            groupName,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            notes,
            lastFetchedAt: new Date(),
        });

        // Create initial history snapshot
        await ChannelHistory.create({
            channelId: newChannel._id,
            followerCount: tikTokData.followerCount,
            followingCount: tikTokData.followingCount,
            totalLikes: tikTokData.totalLikes,
            videoCount: tikTokData.videoCount,
            engagementRate,
        });

        revalidatePath("/channels");
        return { success: true, channel: JSON.parse(JSON.stringify(newChannel)) };
    } catch (error: any) {
        console.error("Failed to add channel:", error);
        return { success: false, error: error.message };
    }
}

export async function getChannels(filters: {
    search?: string;
    groupName?: string;
    minFollowers?: number;
    maxFollowers?: number;
    sortBy?: "followers" | "engagement" | "date";
    sortOrder?: "asc" | "desc";
} = {}) {
    try {
        await connectDB();

        const query: any = {};

        if (filters.search) {
            query.$or = [
                { username: { $regex: filters.search, $options: "i" } },
                { displayName: { $regex: filters.search, $options: "i" } },
            ];
        }

        if (filters.groupName && filters.groupName !== "all") {
            query.groupName = filters.groupName;
        }

        if (filters.minFollowers !== undefined || filters.maxFollowers !== undefined) {
            query.followerCount = {};
            if (filters.minFollowers !== undefined) query.followerCount.$gte = filters.minFollowers;
            if (filters.maxFollowers !== undefined) query.followerCount.$lte = filters.maxFollowers;
        }

        let sort: any = { createdAt: -1 };
        if (filters.sortBy) {
            const field =
                filters.sortBy === "followers"
                    ? "followerCount"
                    : filters.sortBy === "engagement"
                        ? "engagementRate"
                        : "createdAt";
            sort = { [field]: filters.sortOrder === "asc" ? 1 : -1 };
        }

        const channels = await Channel.find(query).sort(sort).lean();
        return JSON.parse(JSON.stringify(channels));
    } catch (error) {
        console.error("Failed to get channels:", error);
        return [];
    }
}

export async function getChannel(username: string) {
    try {
        await connectDB();
        const channel = await Channel.findOne({ username }).lean();
        if (!channel) return null;

        const history = await ChannelHistory.find({ channelId: channel._id })
            .sort({ snapshotDate: 1 }) // Ascending for charts
            .limit(30) // Last 30 entries
            .lean();

        const videos = await Video.find({ channelId: channel._id })
            .sort({ publishedAt: -1 })
            .limit(20)
            .lean();

        return {
            channel: JSON.parse(JSON.stringify(channel)),
            history: JSON.parse(JSON.stringify(history)),
            videos: JSON.parse(JSON.stringify(videos)),
        };
    } catch (error) {
        console.error("Failed to get channel:", error);
        return null;
    }
}

export async function refreshChannel(channelId: string) {
    try {
        await connectDB();
        const channel = await Channel.findById(channelId);
        if (!channel) throw new Error("Channel not found");

        const tikTokData = await fetchTikTokData(channel.username);
        const engagementRate = calculateEngagementRate(
            tikTokData.totalLikes,
            tikTokData.videoCount,
            tikTokData.followerCount
        );

        channel.followerCount = tikTokData.followerCount;
        channel.followingCount = tikTokData.followingCount;
        channel.totalLikes = tikTokData.totalLikes;
        channel.videoCount = tikTokData.videoCount;
        channel.engagementRate = engagementRate;
        channel.lastFetchedAt = new Date();
        // Keep existing bio/avatar or update them? Usually update.
        channel.bio = tikTokData.bio;
        channel.avatarUrl = tikTokData.avatarUrl;
        channel.verified = tikTokData.verified;

        await channel.save();

        await ChannelHistory.create({
            channelId: channel._id,
            followerCount: tikTokData.followerCount,
            followingCount: tikTokData.followingCount,
            totalLikes: tikTokData.totalLikes,
            videoCount: tikTokData.videoCount,
            engagementRate,
            snapshotDate: new Date(),
        });

        revalidatePath("/channels");
        revalidatePath(`/channels/${channel.username}`);
        return { success: true, channel: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Failed to refresh channel:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteChannel(channelId: string) {
    try {
        await connectDB();
        // Deleting videos and history first (cascade)
        await Video.deleteMany({ channelId });
        await ChannelHistory.deleteMany({ channelId });
        await Channel.findByIdAndDelete(channelId);

        revalidatePath("/channels");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to delete channel:", error);
        return { success: false, error: error.message };
    }
}

export async function updateChannel(channelId: string, data: z.infer<typeof updateChannelSchema>) {
    try {
        await connectDB();
        const validated = updateChannelSchema.parse(data);

        // Process tags string to array if provided
        let updateData: any = { ...validated };
        if (typeof validated.tags === 'string') {
            updateData.tags = validated.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }

        const channel = await Channel.findByIdAndUpdate(channelId, updateData, { new: true });

        if (!channel) {
            throw new Error("Channel not found");
        }

        revalidatePath("/channels");
        revalidatePath(`/channels/${channel.username}`);
        return { success: true, channel: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Failed to update channel:", error);
        return { success: false, error: error.message };
    }
}
