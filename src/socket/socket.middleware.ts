import { Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt.util';
import { UserRepository } from '../modules/user/user.repository';

const userRepository = new UserRepository();

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
  role?: string;
}

export const socketAuthMiddleware = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token as string);

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    const userWithTokens = await userRepository.findByEmail(user.email);
    if (!userWithTokens?.tokens.includes(token as string)) {
      return next(new Error('Authentication error: Token has been revoked'));
    }

    socket.userId = decoded.userId;
    socket.email = decoded.email;
    socket.role = decoded.role;

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication error: Invalid or expired token'));
  }
};
