
import { format } from "date-fns";
import { Share2, Download, ChevronDown } from "lucide-react";
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
import { X } from "lucide-react";
import { toast } from "sonner";
import { Submission } from "../types";

interface GeneratedImageCardProps {
  submission: Submission;
  index: number;
  totalSubmissions: number;
  onRegenerate: () => void;
}

export const GeneratedImageCard = ({
  submission,
  index,
  totalSubmissions,
  onRegenerate,
}: GeneratedImageCardProps) => {
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

  const renderSubmissionDetails = () => (
    <div className="space-y-4 text-sm overflow-y-auto max-h-[calc(100vh-10rem)] pr-4">
      <p>
        <strong>Created:</strong> {format(new Date(submission.created_at), "PPpp")}
      </p>
      <p>
        <strong>User ID:</strong> {submission.user_id}
      </p>
      <p>
        <strong>Type:</strong> {submission.type_organisme}
      </p>
      <p>
        <strong>Color:</strong> {submission.kleur_organisme}
      </p>
      <p>
        <strong>Size:</strong> {submission.hoe_groot_organisme}
      </p>
      <p>
        <strong>Amount:</strong> {submission.hoeveel_organism}
      </p>
      <p>
        <strong>Landscape:</strong> {submission.beschrijving_landschap_user}
      </p>
      <p>
        <strong>Features:</strong> {submission.kenmerken_user}
      </p>
      <p>
        <strong>Question 1:</strong> {submission.feedback_vraag1}
      </p>
      <p>
        <strong>Answer 1:</strong> {submission.feedback_antwoord1}
      </p>
      <p>
        <strong>Question 2:</strong> {submission.feedback_vraag2}
      </p>
      <p>
        <strong>Answer 2:</strong> {submission.feedback_antwoord2}
      </p>
      <p>
        <strong>Adjust:</strong> {submission.adjust_organisme ? "Yes" : "No"}
      </p>
      <p>
        <strong>AI Description:</strong> {submission.ai_description}
      </p>
      <p>
        <strong>AI Analysis:</strong> {submission.ai_model_image_analyse}
      </p>
      <p>
        <strong>AI Prompt:</strong> {submission.ai_prompt}
      </p>
      <p>
        <strong>Prompt Model:</strong> {submission.ai_model_prompt_generation}
      </p>
      <p>
        <strong>Image Model:</strong> {submission.ai_model_image_generation}
      </p>
      <p>
        <strong>Image Ratio:</strong> {submission.ai_image_ratio}
      </p>
    </div>
  );

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">
          {index === 0 ? "Latest Generation" : `Generation ${totalSubmissions - index}`}
        </h2>
        {submission.ai_image_url && (
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={submission.ai_image_url}
                alt={`Generated organism ${totalSubmissions - index}`}
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
                alt={`Generated organism ${totalSubmissions - index}`}
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
              {renderSubmissionDetails()}
            </SheetContent>
          </Sheet>
          {index === 0 && totalSubmissions === 1 && (
            <Button onClick={onRegenerate}>Opnieuw genereren?</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
