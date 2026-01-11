import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
// import { Channel } from "@/lib/models/Channel";
// import { Video } from "@/lib/models/Video";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const headerPayload = await headers();
        const signature = headerPayload.get("tiktok-signature");

        if (!verifySignature(body, signature, process.env.TIKTOK_CLIENT_SECRET || "")) {
            return new NextResponse("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body);
        const eventType = event.event; // Assuming standard event field, adjust based on actual payload

        await connectDB();

        console.log("Received TikTok Webhook Event:", eventType, event);

        switch (eventType) {
            case "video.publish":
                // Handle new video
                // await handleNewVideo(event.data);
                break;
            case "user.update":
                // Handle user profile update
                // await handleUserUpdate(event.data);
                break;
            default:
                console.log("Unhandled event type:", eventType);
        }

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Basic HMAC-SHA256 verification (Common standard)
// Note: Verify specific TikTok requirements for signature construction
function verifySignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature) return false;

    const hash = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    // Some APIs prefix with "sha256="
    return signature === hash || signature === `sha256=${hash}`;
}

// Placeholder handlers
// async function handleNewVideo(data: any) {
//   console.log("Processing new video:", data);
// }

// async function handleUserUpdate(data: any) {
//    console.log("Processing user update:", data);
// }
