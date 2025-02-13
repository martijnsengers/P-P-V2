
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
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-4">
        {submission.ai_image_url && (
          <div className="w-full rounded-lg overflow-hidden">
            <ImageDialog
              imageUrl={submission.ai_image_url}
              index={index}
              totalSubmissions={totalSubmissions}
            />
          </div>
        )}
        {submission.latin_name && (
          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            {submission.latin_name}
          </h2>
        )}
        <p className="mt-2 text-gray-600 line-clamp-3">{submission.summary}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
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
