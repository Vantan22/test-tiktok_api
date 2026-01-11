import { Video } from "@/types/video";
import { VideoCard } from "./video-card";

export function VideoGrid({ videos }: { videos: Video[] }) {
    if (videos.length === 0) {
        return <div className="text-center py-12 text-muted-foreground">No videos found.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.map(video => (
                <VideoCard key={video.videoId} video={video} />
            ))}
        </div>
    );
}
