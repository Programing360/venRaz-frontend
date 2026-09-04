import { CloudinaryConfig, CloudinaryUploadResponse } from "../../types";


const STORAGE_KEY = 'member2_cloudinary_config';

// Default config or fallback
export const getCloudinaryConfig = (): CloudinaryConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read Cloudinary config from localStorage', e);
  }

  return {
    cloudName: (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: '',
  };
};

export const saveCloudinaryConfig = (config: CloudinaryConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Cloudinary config', e);
  }
};

/**
 * Upload a file directly to Cloudinary using unsigned upload preset.
 * If Cloudinary is not configured or fails, provides a base64 DataURL fallback for seamless demo usage.
 */
export async function uploadToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; publicId?: string; isCloudinary: boolean; error?: string }> {
  const config = getCloudinaryConfig();

  // If cloud name and upload preset are configured, attempt real Cloudinary upload
  if (config.cloudName && config.uploadPreset) {
    try {
      const url = `https://api.cloudinary.com/v1_1/${config.cloudName.trim()}/image/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.uploadPreset.trim());

      // Use XMLHttpRequest to track progress
      return await new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
            // Return optimized secure url
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
              isCloudinary: true,
            });
          } else {
            let errMsg = `Upload failed with status ${xhr.status}`;
            try {
              const errObj = JSON.parse(xhr.responseText);
              if (errObj.error && errObj.error.message) {
                errMsg = errObj.error.message;
              }
            } catch {
              // ignore
            }
            console.warn('Cloudinary upload error, falling back to local preview:', errMsg);
            // Fallback to local DataURL
            readFileAsDataUrl(file).then((dataUrl) => {
              resolve({
                url: dataUrl,
                isCloudinary: false,
                error: `Cloudinary error: ${errMsg}. Local preview saved instead.`,
              });
            });
          }
        };

        xhr.onerror = () => {
          console.warn('Cloudinary network error, falling back to local preview');
          readFileAsDataUrl(file).then((dataUrl) => {
            resolve({
              url: dataUrl,
              isCloudinary: false,
              error: 'Network error reaching Cloudinary. Local preview saved instead.',
            });
          });
        };

        xhr.send(formData);
      });
    } catch (err: any) {
      console.error('Exception during Cloudinary upload:', err);
      const dataUrl = await readFileAsDataUrl(file);
      return {
        url: dataUrl,
        isCloudinary: false,
        error: err?.message || 'Upload exception. Local preview used.',
      };
    }
  }

  // If no Cloudinary config is set, simulate smooth upload progress and return Data URL
  if (onProgress) {
    for (let p = 10; p <= 100; p += 30) {
      onProgress(p);
      await new Promise((r) => setTimeout(r, 60));
    }
  }

  const dataUrl = await readFileAsDataUrl(file);
  return {
    url: dataUrl,
    isCloudinary: false,
  };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
