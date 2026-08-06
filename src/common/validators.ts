import { REGEX_PATTERNS } from "./regex";

export const isEmail = (email: string): boolean => {
  return REGEX_PATTERNS.EMAIL.test(email);
};

export const isPhoneIndian = (phone: string): boolean => {
  return REGEX_PATTERNS.PHONE_INDIAN.test(phone);
};

export const isUUID = (uuid: string): boolean => {
  return REGEX_PATTERNS.UUID_V4.test(uuid);
};

export const isStrongPassword = (password: string): boolean => {
  return REGEX_PATTERNS.PASSWORD_STRONG.test(password);
};
