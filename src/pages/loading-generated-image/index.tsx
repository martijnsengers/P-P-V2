
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

export default function LoadingGeneratedImagePage() {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, workshopId } = location.state || {};

  useEffect(() => {
    if (!userId || !workshopId) {
      setError("Missende gegevens. Ga terug naar de vorige pagina.");
      return;
    }

    const checkGeneratedImage = async () => {
      try {
        const { data, error: submissionError } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", userId)
          .eq("workshop_id", workshopId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (submissionError) throw submissionError;

        if (data?.ai_image_url) {
          // Store the user_id for regeneration tracking
          localStorage.setItem("regenerating_user_id", userId);
          
          // Generated image is ready, navigate to preview page
          navigate("/preview-generated-image", {
            state: { submissionId: data.id, userId: userId },
          });
        }
      } catch (error) {
        console.error("Error checking generated image:", error);
        setError("Er is iets misgegaan bij het ophalen van de afbeelding.");
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkGeneratedImage, 10000);

    // Initial check
    checkGeneratedImage();

    // Set timeout after 1 minute
    const timeout = setTimeout(() => {
      setError("Het duurt langer dan verwacht. Probeer het later opnieuw.");
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [userId, workshopId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <Header subtitle="Je organisme wordt gevisualiseerd" />
      <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 text-center">
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            <p className="text-muted-foreground">
              Je organisme wordt gevisualiseerd. Een moment geduld.
            </p>
            <div className="flex justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
