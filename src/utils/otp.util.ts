export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (inputOTP: string, storedOTP: string, otpExpiry: Date): boolean => {
  if (inputOTP !== storedOTP) {
    return false;
  }

  if (new Date() > otpExpiry) {
    return false;
  }

  return true;
};

export const getOTPExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};
