
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { toast } from "sonner";
import { GeneratedImageCard } from "./components/GeneratedImageCard";
import { Submission } from "./types";

const PreviewGeneratedImagePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!location.state?.userId) {
        navigate("/");
        return;
      }

      const { data: fetchedSubmissions, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", location.state.userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading submissions:", error);
        toast.error("Error loading submissions");
        return;
      }

      if (!fetchedSubmissions?.[0]?.ai_image_url) {
        toast.error("No image available");
        return;
      }

      setSubmissions(fetchedSubmissions);
    };

    fetchSubmissions();
  }, [location.state, navigate]);

  const handleRegenerate = async () => {
    if (!submissions[0]) return;

    try {
      const { data: newSubmission, error: submissionError } = await supabase
        .from("submissions")
        .insert({
          user_id: submissions[0].user_id,
          url_original_image: submissions[0].url_original_image,
          workshop_id: submissions[0].workshop_id,
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      const sessionData = {
        userId: submissions[0].user_id,
        submissionId: newSubmission.id,
        workshopId: submissions[0].workshop_id,
      };
      localStorage.setItem("workshopSession", JSON.stringify(sessionData));

      navigate("/questions");
    } catch (error) {
      console.error("Error starting regeneration:", error);
      toast.error("Error starting regeneration");
    }
  };

  if (submissions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#E1E6E0]">
      <div className="py-8">
        <Header />
      </div>
      <div className="container max-w-4xl mx-auto pb-8 px-4">
        {submissions.map((submission, index) => (
          <GeneratedImageCard
            key={submission.created_at}
            submission={submission}
            index={index}
            totalSubmissions={submissions.length}
            onRegenerate={handleRegenerate}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewGeneratedImagePage;
