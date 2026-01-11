"use server";

import { searchTikTokUsers, fetchTikTokData } from "@/lib/tiktok-api";

export async function searchTikTok(query: string) {
    try {
        const results = await searchTikTokUsers(query);
        return { success: true, data: results };
    } catch (error: any) {
        console.error("Search TikTok error:", error);
        return { success: false, error: "Failed to search TikTok users" };
    }
}

export async function getTikTokUserData(username: string) {
    try {
        const data = await fetchTikTokData(username);
        return { success: true, data };
    } catch (error: any) {
        console.error("Get TikTok user data error:", error);
        return { success: false, error: "Failed to fetch user data" };
    }
}
