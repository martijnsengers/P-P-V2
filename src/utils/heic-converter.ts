
import heic2any from 'heic2any';

async function convertUsingHeic2any(file: File): Promise<File> {
  try {
    // Log attempt details for debugging
    console.log("Starting HEIC conversion:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Convert HEIC to JPEG blob using heic2any
    const jpegBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.8
    }) as Blob;

    // Create new filename
    const newFilename = file.name.replace(/\.(heic|heif)$/i, '.jpg');

    // Return as File object
    return new File([jpegBlob], newFilename, { type: 'image/jpeg' });
  } catch (error) {
    console.error('HEIC conversion error:', error);
    throw error;
  }
}

export async function convertHeicToJpeg(file: File): Promise<File> {
  // Basic validation
  if (!file) {
    throw new Error("No file provided");
  }

  // Check if file is actually a HEIC/HEIF file
  if (!file.type.toLowerCase().includes('heic') && !file.type.toLowerCase().includes('heif')) {
    // If not HEIC/HEIF, return original file
    return file;
  }

  try {
    return await convertUsingHeic2any(file);
  } catch (error) {
    // Log detailed error for debugging
    console.error("HEIC conversion detailed error:", {
      errorMessage: error.message,
      errorCode: error.code,
      errorName: error.name,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

    throw new Error(`Failed to convert HEIC image: ${error.message}`);
  }
}

export async function uploadHeicWithRetry(file: File, maxRetries = 2): Promise<File> {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} of ${maxRetries}`);
        // Add small delay between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return await convertHeicToJpeg(file);
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      lastError = error;
      
      // If it's not the last attempt, continue to next retry
      if (attempt < maxRetries) {
        continue;
      }
    }
  }

  // If we get here, all attempts failed
  throw new Error(`HEIC conversion failed after ${maxRetries + 1} attempts: ${lastError?.message}`);
}
