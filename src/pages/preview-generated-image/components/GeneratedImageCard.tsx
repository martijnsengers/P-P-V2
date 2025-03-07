
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Submission } from "../types";
import { ImageDialog } from "./ImageDialog";
import { ActionButtons } from "./ActionButtons";

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
  // If there's no image URL, don't render the card at all
  if (!submission.ai_image_url || submission.ai_image_url.trim() === '') {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-4">
        <ImageDialog
          imageUrl={submission.ai_image_url}
          index={index}
          totalSubmissions={totalSubmissions}
        />
        {submission.latin_name && (
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {submission.latin_name}
          </h2>
        )}
        <p className="mt-4 text-gray-600">{submission.summary}</p>
      </CardContent>
      <CardFooter className="w-full p-4 pt-0">
        <ActionButtons
          submission={submission}
          onRegenerate={onRegenerate}
          index={index}
          totalSubmissions={totalSubmissions}
        />
      </CardFooter>
    </Card>
  );
};
