
import heic2any from "heic2any";

export async function convertHeicToJpeg(file: File): Promise<File> {
  // Basic validation
  if (!file) {
    throw new Error("No file provided");
  }

  // Log attempt details for debugging
  console.log("Starting HEIC conversion:", {
    name: file.name,
    size: file.size,
    type: file.type
  });

  try {
    // Try with minimal options first
    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.7,  // Lower quality for better compatibility
    });

    if (!convertedBlob) {
      throw new Error("Conversion returned null result");
    }

    // Handle potential array result
    const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

    // Create new filename
    const newFilename = file.name.replace(/\.(heic|heif)$/i, ".jpg");

    // Create new File with minimal metadata
    return new File([finalBlob], newFilename, {
      type: "image/jpeg"
    });

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

    throw error; // Re-throw to handle in calling code
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
