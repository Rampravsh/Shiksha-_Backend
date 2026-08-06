import path from "path";

export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase().replace(".", "");
};

export const sanitizeFilename = (filename: string): string => {
  const nameWithoutExt = path.basename(filename, path.extname(filename));
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, "_");
  const ext = path.extname(filename);
  return `${cleanName}_${Date.now()}${ext}`;
};

export const bytesToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};
