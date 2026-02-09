import { useEffect, useState } from "react";
import { videosAPI } from "@/services/api";
import { Card } from "./ui/card";
import { Play } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoType: 'youtube' | 'upload';
  videoUrl: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  views: number;
}

const VideoReviews = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await videosAPI.getAllPublic();
      if (res.data?.success) {
        setVideos(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load videos", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async (videoId: string) => {
    setPlaying(videoId);
    try {
      await videosAPI.incrementViews(videoId);
    } catch (error) {
      console.error("Failed to increment views", error);
    }
  };

  const getYouTubeEmbedUrl = (video: Video) => {
    if (video.youtubeId) {
      return `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
    }
    return null;
  };

  if (loading) {
    return null; // or a loading spinner
  }

  if (videos.length === 0) {
    return null; // Hide section if no videos
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Customer Reviews
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about our products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card key={video._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[9/16] bg-black group">
                {playing === video._id ? (
                  video.videoType === 'youtube' ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={getYouTubeEmbedUrl(video) || ''}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      autoPlay
                      src={video.videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <>
                    {video.thumbnailUrl && (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => handlePlay(video._id)}
                        className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all transform group-hover:scale-110"
                      >
                        <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
                {video.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {video.views || 0} views
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReviews;
