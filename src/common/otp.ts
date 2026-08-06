import crypto from "crypto";

export const generateNumericOTP = (length = 6): string => {
  const digits = "0123456789";
  let otp = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];
    if (byte !== undefined) {
      otp += digits[byte % 10];
    }
  }
  return otp;
};

export const generateAlphanumericOTP = (length = 6): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];
    if (byte !== undefined) {
      otp += chars[byte % chars.length];
    }
  }
  return otp;
};
