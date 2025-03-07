
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Submission } from "@/pages/preview-generated-image/types";
import type { Workshop } from "../../workshops/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GalleryGrid() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("all");

  // Fetch workshops for filter
  const { data: workshops } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Workshop[];
    },
  });

  // Fetch submissions with workshop filter
  const { data: items, isLoading } = useQuery({
    queryKey: ["gallery-submissions", selectedWorkshop],
    queryFn: async () => {
      let query = supabase
        .from("submissions")
        .select(`
          *,
          workshops:workshop_id (
            title
          )
        `)
        .order("created_at", { ascending: false });

      if (selectedWorkshop !== "all") {
        query = query.eq("workshop_id", selectedWorkshop);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as (Submission & { workshops: { title: string } | null })[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Filter submissions to only show ones with generated images
  const submissionsWithImages = items?.filter(
    item => item.ai_image_url && item.ai_image_url.trim() !== ''
  );

  if (!submissionsWithImages?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No generated images available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={selectedWorkshop}
          onValueChange={setSelectedWorkshop}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by workshop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workshops</SelectItem>
            {workshops?.map((workshop) => (
              <SelectItem key={workshop.id} value={workshop.id}>
                {workshop.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissionsWithImages.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
            {item.ai_image_url ? (
              <img
                src={item.ai_image_url}
                alt="Generated image"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No generated image
              </div>
            )}
            <div className="p-4">
              <p className="text-sm text-gray-500">
                Workshop: {item.workshops?.title || "Unknown"}
              </p>
              {item.summary && (
                <p className="text-gray-600 mt-1">{item.summary}</p>
              )}
              {!item.summary && item.latin_name && (
                <p className="text-gray-600 mt-1">{item.latin_name}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
