import { v4 as uuidv4 } from "uuid";

export const generateUUID = (): string => {
  return uuidv4();
};

export const safeJsonParse = <T = unknown>(
  jsonString: string,
  fallback: T,
): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};
