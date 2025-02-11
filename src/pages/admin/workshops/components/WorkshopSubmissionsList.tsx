
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

  if (!submissions?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No submissions for this workshop yet
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {submissions.map((submission, index) => (
        <GeneratedImageCard
          key={submission.id} // Changed from created_at to id for better uniqueness
          submission={submission}
          index={index}
          totalSubmissions={submissions.length}
          onRegenerate={() => {}} // Disabled for admin view
        />
      ))}
    </div>
  );
}
