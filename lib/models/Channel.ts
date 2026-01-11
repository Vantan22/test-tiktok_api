import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChannel extends Document {
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    verified: boolean;
    followerCount: number;
    followingCount: number;
    totalLikes: number;
    videoCount: number;
    engagementRate: number;
    groupName?: string;
    tags: string[];
    notes?: string;
    lastFetchedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ChannelSchema = new Schema<IChannel>(
    {
        username: { type: String, required: true, unique: true, index: true },
        displayName: { type: String, required: true },
        bio: { type: String },
        avatarUrl: { type: String },
        verified: { type: Boolean, default: false },
        followerCount: { type: Number, default: 0, index: true },
        followingCount: { type: Number, default: 0 },
        totalLikes: { type: Number, default: 0 },
        videoCount: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0, index: true },
        groupName: { type: String, index: true },
        tags: { type: [String], default: [] },
        notes: { type: String },
        lastFetchedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const Channel: Model<IChannel> =
    mongoose.models.Channel || mongoose.model<IChannel>("Channel", ChannelSchema);
