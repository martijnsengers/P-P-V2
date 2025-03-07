
export interface Workshop {
  id: string;
  title: string;
  access_code: string;
  status: boolean;
  created_at: string;
  workshop_video_url?: string | null;
}
