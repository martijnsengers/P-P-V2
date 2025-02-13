
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
    <Card className="mb-6">
      <CardContent className="p-6">
        {submission.ai_image_url && (
          <div className="w-full">
            <ImageDialog
              imageUrl={submission.ai_image_url}
              index={index}
              totalSubmissions={totalSubmissions}
            />
          </div>
        )}
        {submission.latin_name && (
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {submission.latin_name}
          </h2>
        )}
        <p className="mt-2 text-gray-600 line-clamp-3">{submission.summary}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <ActionButtons
          submission={submission}
          onRegenerate={onRegenerate}
          index={index}
          totalSubmissions={totalSubmissions}
        />
      </CardFooter>
    </Card>
  );
}
