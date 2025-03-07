
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
        
        // Check if the file exists first
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('generated-video-final')
          .list('', {
            search: `${workshopId}.mp4`
          });
          
        if (fileError) {
          console.error("Error checking for video file:", fileError);
          setError("Could not verify workshop video exists");
          setLoading(false);
          return;
        }
        
        if (!fileData || fileData.length === 0) {
          console.log("No video file found for workshop:", workshopId);
          setError("No video found for this workshop");
          setLoading(false);
          return;
        }
        
        // File exists, get signed URL
        const { data, error } = await supabase
          .storage
          .from('generated-video-final')
          .createSignedUrl(`${workshopId}.mp4`, 3600); // 1 hour expiry

        if (error) {
          console.error("Error creating signed URL:", error);
          setError("Could not load workshop video");
          setLoading(false);
          return;
        }

        console.log("Successfully fetched video signed URL");
        setVideoUrl(data.signedUrl);
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
