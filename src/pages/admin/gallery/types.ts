
export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  generated_image_url: string | null;
  created_at: string;
  created_by: string;
  workshop_id: string | null;
}
