import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { requireAdmin } from "@/lib/server-auth";

const ALLOWED_FOLDERS = ["products", "blogs"];

/** POST /api/admin/upload-signature — gives a signed, short-lived permit to upload ONE image. Admin only. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const caller = await requireAdmin(req, res);
  if (!caller) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error: "Image upload is not set up yet. Add the CLOUDINARY_* values to .env and restart the server.",
    });
  }

  const folder = ALLOWED_FOLDERS.includes(req.body?.folder) ? req.body.folder : "products";
  const timestamp = Math.round(Date.now() / 1000);
  // Cloudinary signs the parameters in alphabetical order, followed by the API secret
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return res.status(200).json({ cloudName, apiKey, timestamp, folder, signature });
}