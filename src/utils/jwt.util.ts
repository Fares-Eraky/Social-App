import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  signatureLevel: number;
  iat?: number;
  exp?: number;
}

export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  return jwt.verify(token, secret) as JWTPayload;
};
