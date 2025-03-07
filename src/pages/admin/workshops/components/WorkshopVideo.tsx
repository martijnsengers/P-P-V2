
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Maximize2 } from "lucide-react";

interface WorkshopVideoProps {
  workshopId: string;
}

export function WorkshopVideo({ workshopId }: WorkshopVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        console.log("Fetching video for workshop ID:", workshopId);
        
        // Directly use the public URL structure based on the provided URLs
        const publicUrl = `https://abfrzrhzvfjwwslwawko.supabase.co/storage/v1/object/public/generated_video/final/${workshopId}.mp4`;
        
        // Check if the file exists by making a HEAD request
        const response = await fetch(publicUrl, { method: 'HEAD' });
        
        if (!response.ok) {
          console.log("Video file not found for workshop:", workshopId);
          setError("No video found for this workshop");
          setLoading(false);
          return;
        }
        
        console.log("Successfully found video at:", publicUrl);
        setVideoUrl(publicUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error in video fetch:", err);
        setError("Error loading workshop video");
        setLoading(false);
      }
    };

    if (workshopId) {
      fetchVideo();
    }

    // Subscribe to workshop_video_url updates
    const channel = supabase
      .channel('workshop-video-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workshops',
          filter: `id=eq.${workshopId}`,
        },
        (payload) => {
          console.log("Workshop update detected:", payload);
          // If workshop is updated, refetch the video
          fetchVideo();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workshopId]);

  const handleFullscreen = (videoElement: HTMLVideoElement) => {
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if ((videoElement as any).webkitRequestFullscreen) {
        (videoElement as any).webkitRequestFullscreen();
      } else if ((videoElement as any).msRequestFullscreen) {
        (videoElement as any).msRequestFullscreen();
      }
    }
  };

  if (loading) {
    return <Skeleton className="w-full aspect-video rounded-md" />;
  }

  if (error) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center text-gray-500 aspect-video flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center text-gray-500 aspect-video flex items-center justify-center">
        No final video available for this workshop yet
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md relative group">
      <video 
        controls
        className="w-full aspect-video bg-black"
        src={videoUrl}
        poster="/lovable-uploads/ef4ffb01-0b02-46a0-8148-cc11dc1f4357.png"
      >
        Your browser does not support the video tag.
      </video>
      <button 
        onClick={(e) => {
          const videoElement = e.currentTarget.previousSibling as HTMLVideoElement;
          handleFullscreen(videoElement);
        }}
        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="Fullscreen"
      >
        <Maximize2 className="h-5 w-5" />
      </button>
    </div>
  );
}
