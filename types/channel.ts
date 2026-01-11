export interface Channel {
    _id: string;
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
    lastFetchedAt: string;
    createdAt: string;
    updatedAt: string;
}
