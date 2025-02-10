
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Share2, Download, ChevronDown, ChevronUp, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
};

const PreviewGeneratedImagePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [previousSubmission, setPreviousSubmission] = useState<Submission | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!location.state?.submissionId) {
        navigate("/");
        return;
      }

      const { data: currentSubmission, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", location.state.submissionId)
        .single();

      if (error) {
        toast.error("Error loading submission");
        return;
      }

      setSubmission(currentSubmission);

      // Check for previous submission with same user_id
      const storedUserId = localStorage.getItem("regenerating_user_id");
      if (storedUserId && storedUserId === currentSubmission.user_id) {
        const { data: previousData } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", storedUserId)
          .neq("id", location.state.submissionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (previousData) {
          setPreviousSubmission(previousData);
        }
      }
    };

    fetchSubmission();
  }, [location.state, navigate]);

  const handleShare = async () => {
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
        // Fallback to email sharing
        const mailtoLink = `mailto:?subject=Generated Organism&body=${encodeURIComponent(detailsText)}`;
        window.open(mailtoLink);
      }
    } catch (error) {
      toast.error("Error sharing image");
    }
  };

  const handleSave = async () => {
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

  const handleRegenerate = () => {
    if (submission?.user_id) {
      localStorage.setItem("regenerating_user_id", submission.user_id);
      navigate("/upload");
    }
  };

  if (!submission) {
    return <div>Loading...</div>;
  }

  const renderSubmissionDetails = (sub: Submission) => (
    <div className="space-y-4 text-sm">
      <p><strong>Created:</strong> {format(new Date(sub.created_at), "PPpp")}</p>
      <p><strong>User ID:</strong> {sub.user_id}</p>
      <p><strong>Type:</strong> {sub.type_organisme}</p>
      <p><strong>Color:</strong> {sub.kleur_organisme}</p>
      <p><strong>Size:</strong> {sub.hoe_groot_organisme}</p>
      <p><strong>Amount:</strong> {sub.hoeveel_organism}</p>
      <p><strong>Landscape:</strong> {sub.beschrijving_landschap_user}</p>
      <p><strong>Features:</strong> {sub.kenmerken_user}</p>
      <p><strong>Question 1:</strong> {sub.feedback_vraag1}</p>
      <p><strong>Answer 1:</strong> {sub.feedback_antwoord1}</p>
      <p><strong>Question 2:</strong> {sub.feedback_vraag2}</p>
      <p><strong>Answer 2:</strong> {sub.feedback_antwoord2}</p>
      <p><strong>Adjust:</strong> {sub.adjust_organisme ? "Yes" : "No"}</p>
      <p><strong>AI Description:</strong> {sub.ai_description}</p>
      <p><strong>AI Analysis:</strong> {sub.ai_model_image_analyse}</p>
      <p><strong>AI Prompt:</strong> {sub.ai_prompt}</p>
      <p><strong>Prompt Model:</strong> {sub.ai_model_prompt_generation}</p>
      <p><strong>Image Model:</strong> {sub.ai_model_image_generation}</p>
      <p><strong>Image Ratio:</strong> {sub.ai_image_ratio}</p>
    </div>
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {previousSubmission && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Previous Generation</h2>
            {previousSubmission.ai_image_url && (
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={previousSubmission.ai_image_url}
                    alt="Previous generated organism"
                    className="w-full h-auto rounded-lg cursor-zoom-in"
                  />
                </DialogTrigger>
                <DialogContent className="max-w-screen-lg">
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                  <img
                    src={previousSubmission.ai_image_url}
                    alt="Previous generated organism"
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            )}
            <p className="mt-4 text-gray-600">{previousSubmission.summary}</p>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="mt-4">
                  View Details
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Previous Generation Details</SheetTitle>
                </SheetHeader>
                {renderSubmissionDetails(previousSubmission)}
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">
            {previousSubmission ? "New Generation" : "Generated Image"}
          </h2>
          {submission.ai_image_url && (
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={submission.ai_image_url}
                  alt="Generated organism"
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
                  alt="Generated organism"
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          )}
          <p className="mt-4 text-gray-600">{submission.summary}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleSave}>
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
            {!previousSubmission && (
              <Button onClick={handleRegenerate}>Opnieuw genereren?</Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PreviewGeneratedImagePage;
