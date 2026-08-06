export const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60 * 1000);
};

export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

export const isExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};

export const formatDateToISO = (date: Date = new Date()): string => {
  return date.toISOString();
};
