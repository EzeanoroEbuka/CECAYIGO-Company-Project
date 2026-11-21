import { authFetch } from "@/lib/authFetch";

/** Uploads one image to Cloudinary (using a permit from our server) and returns its https URL. */
export async function uploadImage(file: File, folder: "products" | "blogs"): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error(`"${file.name}" is not an image.`);
  if (file.size > 5 * 1024 * 1024) throw new Error(`"${file.name}" is larger than 5 MB.`);

  const signRes = await authFetch("/api/admin/upload-signature", {
    method: "POST",
    body: JSON.stringify({ folder }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || "Could not start the image upload.");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("folder", sign.folder);
  form.append("signature", sign.signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) throw new Error(data?.error?.message || "Image upload failed.");
  return data.secure_url as string;
}


const MAX_VIDEO_MB = 100; // Cloudinary's free plan limit per video file

/** Uploads one video to Cloudinary with a progress callback (0-100) and returns its https URL. */
export async function uploadVideo(file: File, onProgress?: (percent: number) => void): Promise<string> {
  if (!file.type.startsWith("video/")) throw new Error(`"${file.name}" is not a video file.`);
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`"${file.name}" is larger than ${MAX_VIDEO_MB} MB. Compress it (for example 720p MP4) and try again.`);
  }

  const signRes = await authFetch("/api/admin/upload-signature", {
    method: "POST",
    body: JSON.stringify({ folder: "guides" }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || "Could not start the video upload.");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("folder", sign.folder);
  form.append("signature", sign.signature);

  // XMLHttpRequest (not fetch) because it can report upload progress
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/video/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data: any = {};
      try { data = JSON.parse(xhr.responseText); } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url as string);
      else reject(new Error(data?.error?.message || "Video upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error during video upload."));
    xhr.send(form);
  });
}