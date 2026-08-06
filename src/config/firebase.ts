import { env } from "./env";

const parsePrivateKey = (key: string): string => {
  if (!key) return "";
  let cleanKey = key.trim();
  if (cleanKey.startsWith('"') && cleanKey.endsWith('"')) {
    cleanKey = cleanKey.slice(1, -1);
  }
  return cleanKey.replace(/\\n/g, "\n");
};

export const firebaseConfig = {
  projectId: env.FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey: parsePrivateKey(env.FIREBASE_PRIVATE_KEY),
  isConfigured: Boolean(
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_CLIENT_EMAIL &&
    env.FIREBASE_PRIVATE_KEY,
  ),
} as const;

export type FirebaseConfig = typeof firebaseConfig;
