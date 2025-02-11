
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Share2, Download, ChevronDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Header } from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

type Submission = {
  user_id: string;
  created_at: string;
  type_organisme: string | null;
  kleur_organisme: string | null;
  hoe_groot_organisme: string | null;
  hoeveel_organism: string | null;
  beschrijving_landschap_user: string | null;
  kenmerken_user: string | null;
  feedback_vraag1: string | null;
  feedback_antwoord1: string | null;
  feedback_vraag2: string | null;
  feedback_antwoord2: string | null;
  adjust_organisme: boolean | null;
  ai_description: string | null;
  ai_model_image_analyse: string | null;
  ai_prompt: string | null;
  ai_model_prompt_generation: string | null;
  ai_model_image_generation: string | null;
  ai_image_ratio: string | null;
  ai_image_url: string | null;
  summary: string | null;
  url_original_image: string | null;
  workshop_id: string | null;
};

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

  const handleShare = async (submission: Submission) => {
    try {
      if (!submission?.ai_image_url) return;

      const response = await fetch(submission.ai_image_url);
      const blob = await response.blob();
      const file = new File([blob], "generated-image.jpg", { type: "image/jpeg" });

      const detailsText = `
Generated Image Details:
Type: ${submission.type_organisme}
Color: ${submission.kleur_organisme}
Size: ${submission.hoe_groot_organisme}
Amount: ${submission.hoeveel_organism}
Description: ${submission.beschrijving_landschap_user}
Features: ${submission.kenmerken_user}
AI Description: ${submission.ai_description}
      `.trim();

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "Generated Organism",
          text: detailsText,
        });
      } else {
        const mailtoLink = `mailto:?subject=Generated Organism&body=${encodeURIComponent(detailsText)}`;
        window.open(mailtoLink);
      }
    } catch (error) {
      toast.error("Error sharing image");
    }
  };

  const handleSave = async (submission: Submission) => {
    try {
      if (!submission?.ai_image_url) return;
      const link = document.createElement("a");
      link.href = submission.ai_image_url;
      link.download = "generated-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Error downloading image");
    }
  };

  const handleRegenerate = async () => {
    if (!submissions[0]) return;

    try {
      // Create new submission with original image
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

      // Store regeneration data
      const sessionData = {
        userId: submissions[0].user_id,
        submissionId: newSubmission.id,
        workshopId: submissions[0].workshop_id,
      };
      localStorage.setItem("workshopSession", JSON.stringify(sessionData));

      // Navigate to questions page
      navigate("/questions");
    } catch (error) {
      console.error("Error starting regeneration:", error);
      toast.error("Error starting regeneration");
    }
  };

  if (submissions.length === 0) {
    return <div>Loading...</div>;
  }

  const renderSubmissionDetails = (sub: Submission) => (
    <div className="space-y-4 text-sm overflow-y-auto max-h-[calc(100vh-10rem)] pr-4">
      <p>
        <strong>Created:</strong> {format(new Date(sub.created_at), "PPpp")}
      </p>
      <p>
        <strong>User ID:</strong> {sub.user_id}
      </p>
      <p>
        <strong>Type:</strong> {sub.type_organisme}
      </p>
      <p>
        <strong>Color:</strong> {sub.kleur_organisme}
      </p>
      <p>
        <strong>Size:</strong> {sub.hoe_groot_organisme}
      </p>
      <p>
        <strong>Amount:</strong> {sub.hoeveel_organism}
      </p>
      <p>
        <strong>Landscape:</strong> {sub.beschrijving_landschap_user}
      </p>
      <p>
        <strong>Features:</strong> {sub.kenmerken_user}
      </p>
      <p>
        <strong>Question 1:</strong> {sub.feedback_vraag1}
      </p>
      <p>
        <strong>Answer 1:</strong> {sub.feedback_antwoord1}
      </p>
      <p>
        <strong>Question 2:</strong> {sub.feedback_vraag2}
      </p>
      <p>
        <strong>Answer 2:</strong> {sub.feedback_antwoord2}
      </p>
      <p>
        <strong>Adjust:</strong> {sub.adjust_organisme ? "Yes" : "No"}
      </p>
      <p>
        <strong>AI Description:</strong> {sub.ai_description}
      </p>
      <p>
        <strong>AI Analysis:</strong> {sub.ai_model_image_analyse}
      </p>
      <p>
        <strong>AI Prompt:</strong> {sub.ai_prompt}
      </p>
      <p>
        <strong>Prompt Model:</strong> {sub.ai_model_prompt_generation}
      </p>
      <p>
        <strong>Image Model:</strong> {sub.ai_model_image_generation}
      </p>
      <p>
        <strong>Image Ratio:</strong> {sub.ai_image_ratio}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E1E6E0]">
      <div className="py-8">
        <Header />
      </div>
      <div className="container max-w-4xl mx-auto pb-8 px-4">
        {submissions.map((submission, index) => (
          <Card key={submission.created_at} className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">
                {index === 0 ? "Latest Generation" : `Generation ${submissions.length - index}`}
              </h2>
              {submission.ai_image_url && (
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={submission.ai_image_url}
                      alt={`Generated organism ${submissions.length - index}`}
                      className="w-full h-auto rounded-lg cursor-zoom-in"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-screen-lg">
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                    <img
                      src={submission.ai_image_url}
                      alt={`Generated organism ${submissions.length - index}`}
                      className="w-full h-auto"
                    />
                  </DialogContent>
                </Dialog>
              )}
              <p className="mt-4 text-gray-600">{submission.summary}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleShare(submission)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" onClick={() => handleSave(submission)}>
                  <Download className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              <div className="flex gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      Details
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Generation Details</SheetTitle>
                    </SheetHeader>
                    {renderSubmissionDetails(submission)}
                  </SheetContent>
                </Sheet>
                {index === 0 && submissions.length === 1 && (
                  <Button onClick={handleRegenerate}>Opnieuw genereren?</Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreviewGeneratedImagePage;
