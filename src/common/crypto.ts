import crypto from "crypto";

export const generateRandomToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const generateHash = (data: string, algorithm = "sha256"): string => {
  return crypto.createHash(algorithm).update(data).digest("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
