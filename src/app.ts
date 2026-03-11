import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './modules/user/user.routes';
import postRoutes from './modules/post/post.routes';
import commentRoutes from './modules/comment/comment.routes';
import friendRoutes from './modules/friend/friend.routes';
import chatRoutes from './modules/chat/chat.routes';

export const createApp = (): Application => {
  const app = express();

  app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/posts/:postId/comments', commentRoutes);
  app.use('/api/friends', friendRoutes);
  app.use('/api/chats', chatRoutes);

  app.use(errorHandler);

  return app;
};
