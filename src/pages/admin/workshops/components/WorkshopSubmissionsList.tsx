
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImageCard } from "@/pages/preview-generated-image/components/GeneratedImageCard";
import { Submission } from "@/pages/preview-generated-image/types";

interface WorkshopSubmissionsListProps {
  workshopId: string;
}

export function WorkshopSubmissionsList({ workshopId }: WorkshopSubmissionsListProps) {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["workshop-submissions", workshopId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("workshop_id", workshopId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
    refetchInterval: 60000, // Polling every minute
  });

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading submissions...
      </div>
    );
  }

  // More strict filtering to ensure we only show submissions with valid image URLs
  const submissionsWithImages = submissions?.filter(
    submission => 
      (submission.ai_image_url && submission.ai_image_url.trim() !== '') || 
      (submission.url_original_image && submission.url_original_image.trim() !== '')
  );

  if (!submissionsWithImages?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No submissions with images for this workshop yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissionsWithImages.map((submission, index) => (
        <GeneratedImageCard
          key={submission.id}
          submission={submission}
          index={index}
          totalSubmissions={submissionsWithImages.length}
          onRegenerate={() => {}} // Disabled for admin view
        />
      ))}
    </div>
  );
}
