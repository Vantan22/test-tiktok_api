import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVideo extends Document {
    channelId: mongoose.Types.ObjectId;
    videoId: string;
    title?: string;
    description?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    duration?: number;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    publishedAt?: Date;
    fetchedAt: Date;
    createdAt: Date;
}

const VideoSchema = new Schema<IVideo>(
    {
        channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true, index: true },
        videoId: { type: String, required: true, unique: true, index: true },
        title: { type: String },
        description: { type: String },
        thumbnailUrl: { type: String },
        videoUrl: { type: String },
        duration: { type: Number },
        viewCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 },
        publishedAt: { type: Date },
        fetchedAt: { type: Date, default: Date.now },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Video: Model<IVideo> =
    mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
