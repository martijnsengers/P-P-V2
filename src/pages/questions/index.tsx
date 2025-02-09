
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { QuestionForm } from "./components/QuestionForm";
import { useSessionValidation } from "./hooks/useSessionValidation";
import type { FormType } from "./types";

export default function QuestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getSessionData } = useSessionValidation();

  async function onSubmit(data: FormType) {
    const session = getSessionData();
    if (!session) return;

    setIsLoading(true);
    console.log("Submitting form with data:", { ...session, ...data });

    try {
      // Create new submission
      const { data: submission, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          type_organisme: data.type_organisme,
          kleur_organisme: data.kleur_organisme,
          hoe_groot_organisme: data.hoe_groot_organisme,
          hoeveel_organism: data.hoeveel_organism,
          beschrijving_landschap_user: data.beschrijving_landschap_user,
          kenmerken_user: data.kenmerken_user,
          user_id: session.userId,
          workshop_id: session.workshopId
        })
        .select('id')
        .single();

      if (submissionError) {
        console.error("Error creating submission:", submissionError);
        throw new Error("Kon de inzending niet opslaan");
      }

      console.log("Successfully created submission:", submission);

      toast({
        title: "Succes",
        description: "Je antwoorden zijn succesvol opgeslagen.",
      });

      // Navigate to loading page
      navigate("/loading-questions", {
        state: { 
          userId: session.userId, 
          workshopId: session.workshopId 
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <Header subtitle="Create and explore futuristic plant organisms" />
      <div className="w-full max-w-2xl space-y-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6">
        <QuestionForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
