import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChannelHistory extends Document {
    channelId: mongoose.Types.ObjectId;
    followerCount: number;
    followingCount: number;
    totalLikes: number;
    videoCount: number;
    engagementRate: number;
    snapshotDate: Date;
    createdAt: Date;
}

const ChannelHistorySchema = new Schema<IChannelHistory>(
    {
        channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true, index: true },
        followerCount: { type: Number, required: true },
        followingCount: { type: Number, default: 0 },
        totalLikes: { type: Number, default: 0 },
        videoCount: { type: Number, default: 0 },
        engagementRate: { type: Number, default: 0 },
        snapshotDate: { type: Date, default: Date.now, index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChannelHistory: Model<IChannelHistory> =
    mongoose.models.ChannelHistory || mongoose.model<IChannelHistory>("ChannelHistory", ChannelHistorySchema);
