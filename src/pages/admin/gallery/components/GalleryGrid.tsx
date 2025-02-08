
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GalleryItem } from "../types";

export function GalleryGrid() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["gallery-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!items?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No images have been uploaded yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            {item.description && (
              <p className="text-gray-600 mt-1">{item.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
