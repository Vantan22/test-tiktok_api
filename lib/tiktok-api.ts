import { wait } from "@/lib/utils";

export interface TikTokUserData {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
    verified: boolean;
    followerCount: number;
    followingCount: number;
    totalLikes: number;
    videoCount: number;
}

export async function fetchTikTokData(username: string): Promise<TikTokUserData> {
    // Mock implementation
    await wait(1000); // Simulate API latency

    // Generate random stats for demo
    const followerCount = Math.floor(Math.random() * 1000000) + 1000;
    const followingCount = Math.floor(Math.random() * 500);
    const totalLikes = Math.floor(followerCount * (Math.random() * 10 + 5));
    const videoCount = Math.floor(Math.random() * 200) + 10;

    return {
        username,
        displayName: username.replace(/[\._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        bio: "This is a mock bio for " + username + ". Content creator and influencer.",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        verified: Math.random() > 0.8,
        followerCount,
        followingCount,
        totalLikes,
        videoCount,
    };
}

export async function searchTikTokUsers(query: string): Promise<TikTokUserData[]> {
    await wait(1000);

    // Return mocked list based on query
    return Array.from({ length: 5 }).map((_, i) => {
        const username = `${query}${i === 0 ? "" : i}`;
        const followerCount = Math.floor(Math.random() * 500000) + 100;

        return {
            username,
            displayName: `${query} Official ${i}`,
            bio: `Mock bio for search result ${i}`,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            verified: i === 0,
            followerCount: followerCount,
            followingCount: Math.floor(Math.random() * 100),
            totalLikes: Math.floor(followerCount * 12),
            videoCount: Math.floor(Math.random() * 50),
        };
    });
}
