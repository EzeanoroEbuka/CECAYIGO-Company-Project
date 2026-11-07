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