
import { Share2, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Submission } from "../types";
import { SubmissionDetails } from "./SubmissionDetails";

interface ActionButtonsProps {
  submission: Submission;
  onRegenerate?: () => void;
  index: number;
  totalSubmissions: number;
}

export const ActionButtons = ({ submission, onRegenerate, index, totalSubmissions }: ActionButtonsProps) => {
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

  return (
    <div className="flex justify-between pt-6">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleShare} title="Share">
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={handleSave} title="Save">
          <Download className="h-5 w-5" />
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
            <SubmissionDetails submission={submission} />
          </SheetContent>
        </Sheet>
        {index === 0 && totalSubmissions === 1 && onRegenerate && (
          <Button onClick={onRegenerate}>Opnieuw genereren?</Button>
        )}
      </div>
    </div>
  );
};
