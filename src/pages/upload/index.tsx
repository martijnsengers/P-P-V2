
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { uploadHeicWithRetry } from "@/utils/heic-converter";

export default function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Get session data from localStorage
  const getSessionData = () => {
    const session = localStorage.getItem('workshopSession');
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ongeldige sessie. Start opnieuw.",
      });
      navigate("/");
      return null;
    }
    return JSON.parse(session);
  };

  useEffect(() => {
    // Verify session on component mount
    const session = getSessionData();
    if (!session) return;

    // Optional: Check if session is expired (e.g., after 2 hours)
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    if (Date.now() - session.timestamp > TWO_HOURS) {
      localStorage.removeItem('workshopSession');
      toast({
        variant: "destructive",
        title: "Sessie verlopen",
        description: "Je sessie is verlopen. Start opnieuw.",
      });
      navigate("/");
      return;
    }
  }, [navigate, toast]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const session = getSessionData();
    if (!session) return;

    setIsUploading(true);
    const file = acceptedFiles[0];

    try {
      // Convert file with retry mechanism if it's HEIC/HEIF
      const processedFile = await uploadHeicWithRetry(file);

      // Generate a unique filename for storage
      const filename = `${crypto.randomUUID()}.${processedFile.type === "image/jpeg" ? "jpg" : "png"}`;

      // Upload to Supabase with explicit content type
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("original_uploads")
        .upload(filename, processedFile, {
          contentType: processedFile.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("original_uploads")
        .getPublicUrl(filename);

      console.log("Public URL:", publicUrl); // Debug log

      // Update the submission with the public image URL
      const { error: updateError } = await supabase
        .from("submissions")
        .update({ url_original_image: publicUrl })
        .eq("user_id", session.userId)
        .eq("workshop_id", session.workshopId);

      if (updateError) {
        console.error("Update error:", updateError); // Debug log
        throw updateError;
      }

      toast({
        title: "Upload succesvol",
        description: "Je foto is succesvol geüpload.",
      });

      // Navigate to next page
      navigate("/questions");

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload mislukt",
        description: error.message || "Er is een fout opgetreden bij het uploaden van je foto.",
      });
    } finally {
      setIsUploading(false);
    }
  }, [navigate, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"]
    },
    maxFiles: 1,
  });

  return (
    <div className="min-h-screen bg-[#E1E6E0] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <Header />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Upload je foto</h2>
          <p className="text-primary/70">
            Ondersteunde formaten: JPG, PNG, HEIC
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12
            flex flex-col items-center justify-center
            bg-white cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300"}
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input {...getInputProps()} />
          <ImagePlus 
            className="h-12 w-12 text-gray-400 mb-4" 
          />
          <p className="text-lg font-medium mb-1">
            Klik om te selecteren
          </p>
          <p className="text-gray-500">
            of sleep een bestand hierheen
          </p>
          {isUploading && (
            <p className="mt-4 text-primary">
              Bezig met uploaden...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
