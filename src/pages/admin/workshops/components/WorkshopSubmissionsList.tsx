
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GeneratedImageCard } from "@/pages/preview-generated-image/components/GeneratedImageCard";
import { Submission } from "@/pages/preview-generated-image/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface WorkshopSubmissionsListProps {
  workshopId: string;
}

export function WorkshopSubmissionsList({ workshopId }: WorkshopSubmissionsListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["workshop-submissions", workshopId],
    queryFn: async () => {
      try {
        const adminEmail = localStorage.getItem('adminEmail');
        if (!adminEmail) {
          throw new Error("Not authenticated");
        }

        const { data, error } = await supabase
          .from("submissions")
          .select("*")
          .eq("workshop_id", workshopId)
          .not('ai_image_url', 'is', null)  // Only select submissions with images
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching submissions:", error);
          throw error;
        }
        return data as Submission[];
      } catch (error: any) {
        if (error.message.includes("Not authenticated")) {
          localStorage.removeItem('adminEmail');
          navigate("/admin/login");
        }
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
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
        No submissions with generated images for this workshop yet
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {submissions.map((submission, index) => (
          <GeneratedImageCard
            key={submission.id}
            submission={submission}
            index={index}
            totalSubmissions={submissions.length}
            onRegenerate={() => {}} // Disabled for admin view
          />
        ))}
      </div>
    </div>
  );
}
