
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

export default function FeedbackQuestionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId, workshopId, feedback_vraag1, feedback_vraag2 } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [question1Answered, setQuestion1Answered] = useState(false);
  const [question2Answered, setQuestion2Answered] = useState(false);

  useEffect(() => {
    if (!userId || !workshopId || !feedback_vraag1 || !feedback_vraag2) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missende gegevens. Start opnieuw.",
      });
      navigate("/");
    }
  }, [userId, workshopId, feedback_vraag1, feedback_vraag2, navigate, toast]);

  const handleAnswer = async (
    questionNumber: 1 | 2,
    answer: "ja" | "nee"
  ) => {
    try {
      const { error } = await supabase
        .from("submissions")
        .update({
          [`feedback_antwoord${questionNumber}`]: answer,
        })
        .eq("user_id", userId)
        .eq("workshop_id", workshopId);

      if (error) throw error;

      // Enable the next question or the adjustment question
      if (questionNumber === 1) {
        setQuestion1Answered(true);
      } else {
        setQuestion2Answered(true);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Kon het antwoord niet opslaan. Probeer opnieuw.",
      });
    }
  };

  const handleAdjustment = async (adjust: boolean) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("submissions")
        .update({
          adjust_organisme: adjust,
        })
        .eq("user_id", userId)
        .eq("workshop_id", workshopId);

      if (error) throw error;

      if (adjust) {
        navigate("/upload");
      } else {
        navigate("/loading-generated-image", {
          state: { userId, workshopId }
        });
      }
    } catch (error) {
      console.error("Error saving adjustment choice:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <Header subtitle="Beantwoord de vragen over je organisme" />
      <div className="w-full max-w-2xl space-y-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6">
        {/* Question 1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vraag 1:</h2>
          <p className="text-lg">{feedback_vraag1}</p>
          <div className="flex gap-4">
            <Button 
              onClick={() => handleAnswer(1, "ja")}
              variant="outline"
              disabled={question1Answered}
            >
              Ja
            </Button>
            <Button
              onClick={() => handleAnswer(1, "nee")}
              variant="outline"
              disabled={question1Answered}
            >
              Nee
            </Button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Vraag 2:</h2>
          <p className="text-lg">{feedback_vraag2}</p>
          <div className="flex gap-4">
            <Button
              onClick={() => handleAnswer(2, "ja")}
              variant="outline"
              disabled={!question1Answered || question2Answered}
            >
              Ja
            </Button>
            <Button
              onClick={() => handleAnswer(2, "nee")}
              variant="outline"
              disabled={!question1Answered || question2Answered}
            >
              Nee
            </Button>
          </div>
        </div>

        {/* Adjustment Question */}
        {question1Answered && question2Answered && (
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-xl font-semibold">
              Wil je na aanleiding van deze vragen je organisme nog aanpassen?
            </h2>
            <div className="flex gap-4">
              <Button
                onClick={() => handleAdjustment(true)}
                variant="outline"
                disabled={isSubmitting}
              >
                Ja
              </Button>
              <Button
                onClick={() => handleAdjustment(false)}
                variant="outline"
                disabled={isSubmitting}
              >
                Nee
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
