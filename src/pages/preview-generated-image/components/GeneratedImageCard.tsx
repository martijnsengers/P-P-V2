
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
    <Card className="flex flex-col h-full overflow-hidden">
      <CardContent className="p-4 flex-grow">
        {submission.ai_image_url && (
          <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden">
            <ImageDialog
              imageUrl={submission.ai_image_url}
              index={index}
              totalSubmissions={totalSubmissions}
            />
          </div>
        )}
        {submission.latin_name && (
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {submission.latin_name}
          </h2>
        )}
        <p className="text-gray-600 line-clamp-3">{submission.summary}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
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
