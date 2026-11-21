/** Decides how a guide's video link should be played: <video> for files, <iframe> for YouTube/Vimeo. */
export function resolveVideo(url: string): { kind: "file" | "embed"; src: string } {
  const u = (url || "").trim();

  // Uploaded to Cloudinary, or any direct video file link
  if (/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(u) || /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(u)) {
    return { kind: "file", src: u };
  }
  // YouTube: normal watch links, share links, shorts and embed links all become embed links
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "embed", src: `https://www.youtube.com/embed/${yt[1]}` };
  // Vimeo
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: "embed", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  return { kind: "embed", src: u };
}