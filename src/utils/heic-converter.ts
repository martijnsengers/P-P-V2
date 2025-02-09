
import heic2any from "heic2any";

interface ConversionOptions {
  quality?: number;
  preserveOriginalName?: boolean;
  maxDimensions?: { width: number; height: number };
}

export async function convertHeicToJpeg(
  file: File,
  options: ConversionOptions = {}
): Promise<File> {
  const {
    quality = 0.8,
    preserveOriginalName = true,
    maxDimensions
  } = options;

  // Validate input file
  if (!file) {
    throw new Error("No file provided");
  }

  // Check if file is HEIC/HEIF
  const isHeic = 
    file.type.toLowerCase().includes("heic") || 
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (!isHeic) {
    return file; // Return original if not HEIC/HEIF
  }

  try {
    // Convert HEIC to JPEG
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality,
      ...(maxDimensions && {
        max: {
          width: maxDimensions.width,
          height: maxDimensions.height
        }
      })
    });

    if (!convertedBlob) {
      throw new Error("Conversion failed - no blob returned");
    }

    // Handle array or single blob result
    const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    // Generate new filename
    const originalName = file.name;
    const newFilename = preserveOriginalName
      ? originalName.replace(/\.(heic|heif)$/i, ".jpg")
      : `converted_${Date.now()}.jpg`;

    // Create new File object
    const convertedFile = new File([finalBlob], newFilename, {
      type: "image/jpeg",
      lastModified: new Date().getTime()
    });

    return convertedFile;
  } catch (error) {
    console.error("HEIC conversion error:", error);
    throw new Error(`Failed to convert HEIC to JPEG: ${error.message}`);
  }
}
