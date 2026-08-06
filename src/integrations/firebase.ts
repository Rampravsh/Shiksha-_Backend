import admin from "firebase-admin";
import { firebaseConfig } from "../config/firebase";
import { logger } from "../core/logger";

let firebaseApp: admin.app.App | null = null;

export const initializeFirebase = (): admin.app.App | null => {
  if (!firebaseConfig.isConfigured) {
    logger.warn(
      "Firebase Admin SDK configuration incomplete. Skipping initialization.",
    );
    return null;
  }

  try {
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          clientEmail: firebaseConfig.clientEmail,
          privateKey: firebaseConfig.privateKey,
        }),
      });
      logger.info("🔥 Firebase Admin SDK initialized successfully");
    } else {
      firebaseApp = admin.app();
    }
    return firebaseApp;
  } catch (error) {
    logger.error({ error }, "Failed to initialize Firebase Admin SDK");
    return null;
  }
};

/**
 * Verify Firebase Auth ID Token sent from Client (React / Flutter / Mobile App)
 */
export const verifyFirebaseToken = async (
  idToken: string,
): Promise<admin.auth.DecodedIdToken | null> => {
  try {
    if (!admin.apps.length) {
      initializeFirebase();
    }
    return await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    logger.error({ error }, "Firebase ID token verification failed");
    return null;
  }
};

/**
 * Create user in Firebase Auth via Firebase Admin SDK
 */
export const createFirebaseUser = async (
  email: string,
  password?: string,
  displayName?: string,
): Promise<admin.auth.UserRecord | null> => {
  try {
    if (!admin.apps.length) {
      initializeFirebase();
    }
    return await admin.auth().createUser({
      email,
      password,
      displayName,
    });
  } catch (error) {
    logger.error({ error, email }, "Failed to create user in Firebase Auth");
    return null;
  }
};

/**
 * Delete user in Firebase Auth via Firebase Admin SDK
 */
export const deleteFirebaseUser = async (uid: string): Promise<boolean> => {
  try {
    if (!admin.apps.length) {
      initializeFirebase();
    }
    await admin.auth().deleteUser(uid);
    return true;
  } catch (error) {
    logger.error({ error, uid }, "Failed to delete user in Firebase Auth");
    return false;
  }
};

/**
 * Send FCM Push Notification to a single device
 */
export const sendPushNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<boolean> => {
  try {
    if (!admin.apps.length) {
      initializeFirebase();
    }
    await admin.messaging().send({
      token,
      notification: {
        title,
        body,
      },
      data,
    });
    logger.info({ token, title }, "FCM push notification sent successfully");
    return true;
  } catch (error) {
    logger.error({ error, token }, "Failed to send FCM push notification");
    return false;
  }
};

/**
 * Send FCM Push Notification to multiple devices
 */
export const sendMulticastNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<admin.messaging.BatchResponse | null> => {
  try {
    if (!admin.apps.length) {
      initializeFirebase();
    }
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data,
    });
    logger.info(
      {
        successCount: response.successCount,
        failureCount: response.failureCount,
      },
      "FCM multicast push notification sent",
    );
    return response;
  } catch (error) {
    logger.error({ error }, "Failed to send FCM multicast push notification");
    return null;
  }
};
