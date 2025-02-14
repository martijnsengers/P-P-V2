
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function LoadingQuestionsPage() {
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("Interessant. Laat me dit eens goed analyseren. Een moment geduld.");
  const location = useLocation();
  const navigate = useNavigate();
  const { submissionId, userId } = location.state || {};

  useEffect(() => {
    if (!submissionId) {
      setError("Missende gegevens. Ga terug naar de vorige pagina.");
      return;
    }

    const checkSubmission = async () => {
      try {
        const { data, error: submissionError } = await supabase
          .from("submissions")
          .select("feedback_vraag1, feedback_vraag2, type_organisme")
          .eq("id", submissionId)
          .single();

        if (submissionError) throw submissionError;

        if (data?.feedback_vraag1 && data?.feedback_vraag2) {
          // Questions are ready, navigate to feedback questions page
          navigate("/feedback-questions", {
            state: { 
              submissionId,
              userId,
              feedback_vraag1: data.feedback_vraag1,
              feedback_vraag2: data.feedback_vraag2
            },
          });
        }
      } catch (error) {
        console.error("Error checking submission:", error);
        setError("Er is iets misgegaan bij het ophalen van de vragen.");
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkSubmission, 10000);

    // Initial check
    checkSubmission();

    // Set timeout after 1 minute
    const timeout = setTimeout(() => {
      setError("Het duurt langer dan verwacht. Probeer het later opnieuw.");
      clearInterval(interval);
    }, 60000);

    // Set new loading message after 15 seconds
    const messageTimeout = setTimeout(async () => {
      try {
        const { data } = await supabase
          .from("submissions")
          .select("type_organisme")
          .eq("id", submissionId)
          .single();
        
        if (data?.type_organisme) {
          setLoadingMessage(`Analyseren van de structuur van ${data.type_organisme}`);
        }
      } catch (error) {
        console.error("Error fetching organism type:", error);
      }
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(messageTimeout);
    };
  }, [submissionId, userId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6 text-center">
        <h1 className="text-2xl font-bold">Analyse organisme</h1>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            <p className="text-muted-foreground">
              {loadingMessage}
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
