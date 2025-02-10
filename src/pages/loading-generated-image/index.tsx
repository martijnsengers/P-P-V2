
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

export default function LoadingGeneratedImagePage() {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get session data from localStorage
    const sessionData = localStorage.getItem('workshopSession');
    if (!sessionData) {
      setError("Geen geldige sessie gevonden.");
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Geen geldige sessie gevonden.",
      });
      navigate("/");
      return;
    }

    const session = JSON.parse(sessionData);
    const userId = session.userId;

    if (!userId) {
      setError("Geen gebruiker ID gevonden.");
      return;
    }

    const checkGeneratedImage = async () => {
      try {
        const { data, error: submissionError } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", userId)
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
  }, [navigate, toast]);

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
