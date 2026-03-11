import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { socketAuthMiddleware, AuthenticatedSocket } from './socket.middleware';
import { connectedSockets } from './connected-sockets.map';
import { SocketEvents } from './socket.events';
import { ChatRepository } from '../modules/chat/chat.repository';

export class SocketGateway {
  private io!: Server;
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  initialize(httpServer: HttpServer): Server {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    console.log('Socket.IO initialized');
    return this.io;
  }

  private setupMiddleware(): void {
    this.io.use(socketAuthMiddleware);
  }

  private setupEventHandlers(): void {
    this.io.on(SocketEvents.CONNECT, (socket: AuthenticatedSocket) => {
      this.handleConnection(socket);
    });
  }

  private handleConnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    console.log(`User ${userId} connected with socket ${socket.id}`);

    connectedSockets.addSocket(userId, socket.id);

    this.joinUserRooms(socket, userId);

    socket.on(SocketEvents.DISCONNECT, () => this.handleDisconnect(socket));
    socket.on(SocketEvents.TYPING_START, (data) => this.handleTypingStart(socket, data));
    socket.on(SocketEvents.TYPING_STOP, (data) => this.handleTypingStop(socket, data));
  }

  private async joinUserRooms(socket: AuthenticatedSocket, userId: string): Promise<void> {
    try {
      const chats = await this.chatRepository.getUserChats(userId);
      const groupChats = chats.filter((chat) => chat.type === 'group');

      for (const chat of groupChats) {
        const roomName = `chat:${chat._id.toString()}`;
        socket.join(roomName);
        console.log(`User ${userId} joined room ${roomName}`);
      }
    } catch (error) {
      console.error('Error joining user rooms:', error);
    }
  }

  private handleDisconnect(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    console.log(`User ${userId} disconnected socket ${socket.id}`);
    connectedSockets.removeSocket(userId, socket.id);
  }

  private handleTypingStart(socket: AuthenticatedSocket, data: { chatId: string }): void {
    socket.to(`chat:${data.chatId}`).emit(SocketEvents.TYPING_START, {
      userId: socket.userId,
      chatId: data.chatId,
    });
  }

  private handleTypingStop(socket: AuthenticatedSocket, data: { chatId: string }): void {
    socket.to(`chat:${data.chatId}`).emit(SocketEvents.TYPING_STOP, {
      userId: socket.userId,
      chatId: data.chatId,
    });
  }

  emitToUser(userId: string, event: string, data: any): void {
    const socketIds = connectedSockets.getUserSockets(userId);
    socketIds.forEach((socketId) => {
      this.io.to(socketId).emit(event, data);
    });
  }

  emitToRoom(room: string, event: string, data: any): void {
    this.io.to(room).emit(event, data);
  }

  broadcastToRoom(room: string, event: string, data: any, excludeSocketId: string): void {
    this.io.to(room).except(excludeSocketId).emit(event, data);
  }

  getIO(): Server {
    return this.io;
  }
}

export const socketGateway = new SocketGateway();
