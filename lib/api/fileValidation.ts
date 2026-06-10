const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "image/svg+xml", "video/mp4", "video/webm", "application/pdf",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function validateMediaFile(file: File): string | null {
  if (file.size > MAX_SIZE_BYTES) {
    return `File "${file.name}" exceeds the 10 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `File type "${file.type}" is not allowed. Use JPEG, PNG, WebP, GIF, SVG, MP4, WebM, or PDF.`;
  }
  return null;
}

export function validateMediaFiles(files: File[]): string | null {
  if (files.length > 10) return "Maximum 10 files per upload";
  for (const file of files) {
    const error = validateMediaFile(file);
    if (error) return error;
  }
  return null;
}
