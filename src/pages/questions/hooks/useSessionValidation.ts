
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSessionValidation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getSessionData = () => {
    const session = localStorage.getItem('workshopSession');
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ongeldige sessie. Start opnieuw.",
      });
      navigate("/");
      return null;
    }
    return JSON.parse(session);
  };

  useEffect(() => {
    const verifySession = async () => {
      const session = getSessionData();
      if (!session) return;

      if (!session.submissionId) {
        toast({
          title: "Error",
          description: "Geen inzending ID gevonden. Start opnieuw.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        // Get submission by specific ID stored in session
        const { data: existingSubmission, error: fetchError } = await supabase
          .from("submissions")
          .select("id")
          .eq("id", session.submissionId)
          .maybeSingle();

        if (fetchError || !existingSubmission) {
          console.error("Error fetching submission:", fetchError);
          toast({
            title: "Error",
            description: "Kon de inzending niet vinden. Start opnieuw.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Session verification error:", error);
        toast({
          title: "Error",
          description: "Er is een fout opgetreden. Start opnieuw.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    verifySession();
  }, [navigate, toast]);

  return { getSessionData };
};
