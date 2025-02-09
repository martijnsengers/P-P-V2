
/**
 * Utility functions for converting HEIC images to JPEG format using browser-native APIs
 */

async function convertUsingBrowserNative(file: File): Promise<File> {
  try {
    // Create an image bitmap from the file
    const bitmap = await createImageBitmap(file);
    
    // Create a canvas with the same dimensions
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    // Get the canvas context and draw the image
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    
    // Draw the image onto the canvas
    ctx.drawImage(bitmap, 0, 0);
    
    // Convert to blob with JPEG format
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          throw new Error("Failed to convert canvas to blob");
        }
      }, 'image/jpeg', 0.8);
    });

    // Create new filename
    const newFilename = file.name.replace(/\.(heic|heif)$/i, '.jpg');

    // Return as File object
    return new File([blob], newFilename, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Browser native conversion error:', error);
    throw error;
  }
}

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
    return await convertUsingBrowserNative(file);
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

    throw error;
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
