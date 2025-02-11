
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
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-lg font-semibold mb-4">
          {index === 0 ? "Latest Generation" : `Generation ${totalSubmissions - index}`}
        </h2>
        {submission.ai_image_url && (
          <ImageDialog
            imageUrl={submission.ai_image_url}
            index={index}
            totalSubmissions={totalSubmissions}
          />
        )}
        <p className="mt-4 text-gray-600">{submission.summary}</p>
      </CardContent>
      <CardFooter>
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

