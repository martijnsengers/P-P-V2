
import { Submission } from "@/pages/preview-generated-image/types";

export interface GalleryItem extends Submission {
  workshops?: {
    title: string;
  } | null;
}
