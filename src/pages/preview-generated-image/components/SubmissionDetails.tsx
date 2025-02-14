
import { format } from "date-fns";
import { Submission } from "../types";

interface SubmissionDetailsProps {
  submission: Submission;
}

export const SubmissionDetails = ({ submission }: SubmissionDetailsProps) => {
  return (
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
};

