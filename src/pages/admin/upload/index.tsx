
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import heic2any from "heic2any";
import { ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

export default function UploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const file = acceptedFiles[0];

    try {
      // First determine if it's a HEIC/HEIF file by checking both extension and mime type
      const isHeic = file.type.toLowerCase().includes('heic') || 
                    file.name.toLowerCase().endsWith('.heic') ||
                    file.name.toLowerCase().endsWith('.heif');

      let processedFile = file;
      
      if (isHeic) {
        toast({
          title: "Converting image",
          description: "Je HEIC foto wordt omgezet naar JPEG...",
        });

        try {
          // Convert HEIC to JPEG with explicit error handling
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });

          // Handle both array and single blob responses
          const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          
          // Create a new filename by replacing the extension
          const newFilename = file.name.replace(/\.(heic|HEIC|heif|HEIF)$/, '.jpg');
          
          // Create a new File object with the converted blob
          processedFile = new File([finalBlob], newFilename, {
            type: "image/jpeg",
            lastModified: new Date().getTime()
          });
        } catch (conversionError) {
          console.error("HEIC conversion error:", conversionError);
          throw new Error("Could not convert HEIC image. Please try uploading a JPEG or PNG instead.");
        }
      }

      // Generate a unique filename for storage
      const filename = `${crypto.randomUUID()}.${processedFile.type === 'image/jpeg' ? 'jpg' : 'png'}`;

      // Upload to Supabase with explicit content type
      const { data, error } = await supabase.storage
        .from("original_images")
        .upload(filename, processedFile, {
          contentType: processedFile.type,
          upsert: false
        });

      if (error) throw error;

      toast({
        title: "Upload succesvol",
        description: "Je foto is succesvol geüpload.",
      });

      // Navigate to next page with the image path
      navigate("/admin/questions", { 
        state: { imageUrl: data.path }
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Er is een fout opgetreden bij het uploaden van je foto.",
      });
    } finally {
      setIsUploading(false);
    }
  }, [navigate, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif']
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
