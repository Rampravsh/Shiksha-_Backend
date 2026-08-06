jest.mock("../src/core/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock("../src/integrations/firebase", () => ({
  initializeFirebase: jest.fn(),
  verifyFirebaseToken: jest.fn(),
  createFirebaseUser: jest.fn().mockResolvedValue({
    uid: "fb_real_user_uid_12345",
    email: "newuser@shiksha.app",
  }),
  deleteFirebaseUser: jest.fn().mockResolvedValue(true),
  sendPushNotification: jest.fn().mockResolvedValue(true),
  sendMulticastNotification: jest.fn().mockResolvedValue(null),
}));
