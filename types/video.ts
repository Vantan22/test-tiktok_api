export interface Video {
    _id: string;
    channelId: string;
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
    publishedAt?: string;
    fetchedAt: string;
    createdAt: string;
}
