
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { GalleryGrid } from "./components/GalleryGrid";
import { Upload } from "lucide-react";

export default function GalleryPage() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Generated Images Gallery</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/admin/upload")}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload New Image
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}
