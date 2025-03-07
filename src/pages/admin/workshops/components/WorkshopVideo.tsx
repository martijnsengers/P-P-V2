
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
  }, [workshopId]);

  if (loading) {
    return <Skeleton className="w-full h-64 rounded-md" />;
  }

  if (error) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center text-gray-500">
        {error}
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center text-gray-500">
        No final video available for this workshop yet
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-md bg-black">
      <video 
        controls
        className="w-full h-auto"
        src={videoUrl}
        poster="/placeholder.svg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
