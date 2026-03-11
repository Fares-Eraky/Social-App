import { ChatRepository } from './chat.repository';
import { SendMessageInput, CreateGroupInput, GetOrCreateChatInput } from './chat.validation';
import { FriendRepository } from '../friend/friend.repository';
import { UserRepository } from '../user/user.repository';
import { AppException } from '../../utils/exception.class';
import { StatusCodes } from '../../shared/constants/status-codes';
import { socketGateway } from '../../socket/socket.gateway';
import { SocketEvents } from '../../socket/socket.events';

export class ChatService {
  private chatRepository: ChatRepository;
  private friendRepository: FriendRepository;
  private userRepository: UserRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
    this.friendRepository = new FriendRepository();
    this.userRepository = new UserRepository();
  }

  async getOrCreateChat(userId: string, data: GetOrCreateChatInput) {
    const areFriends = await this.friendRepository.areFriends(userId, data.recipientId);
    if (!areFriends) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You can only chat with friends');
    }

    let chat = await this.chatRepository.findChatByParticipants(userId, data.recipientId);

    if (!chat) {
      chat = await this.chatRepository.create({
        type: 'one-on-one',
        participants: [userId as any, data.recipientId as any],
      });
    }

    await chat.populate('participants', 'username profilePicture email');
    return chat;
  }

  async sendMessage(userId: string, chatId: string, data: SendMessageInput) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Chat not found');
    }

    if (!chat.participants.some((p) => p.toString() === userId)) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You are not a participant in this chat');
    }

    const message = await this.chatRepository.createMessage({
      chatId: chatId as any,
      senderId: userId as any,
      content: data.content,
      type: data.type || 'text',
      fileUrl: data.fileUrl,
      readBy: [userId as any],
    });

    chat.lastMessage = message._id as any;
    chat.lastMessageAt = new Date();
    await chat.save();

    await message.populate('senderId', 'username profilePicture');

    const recipientId = chat.participants.find((p) => p.toString() !== userId)?.toString();
    if (recipientId) {
      socketGateway.emitToUser(recipientId, SocketEvents.MESSAGE_RECEIVED, {
        chatId,
        message,
      });
    }

    return message;
  }

  async getMessages(userId: string, chatId: string, page: number = 1, limit: number = 50) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Chat not found');
    }

    if (!chat.participants.some((p) => p.toString() === userId)) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You are not a participant in this chat');
    }

    return await this.chatRepository.getPaginatedMessages(chatId, page, limit);
  }

  async createGroupChat(userId: string, data: CreateGroupInput) {
    const allParticipants = [userId, ...data.participantIds];

    for (const participantId of data.participantIds) {
      const user = await this.userRepository.findById(participantId);
      if (!user) {
        throw new AppException(StatusCodes.NOT_FOUND, `User ${participantId} not found`);
      }

      const areFriends = await this.friendRepository.areFriends(userId, participantId);
      if (!areFriends) {
        throw new AppException(
          StatusCodes.FORBIDDEN,
          'All group members must be friends with the creator'
        );
      }
    }

    const chat = await this.chatRepository.create({
      type: 'group',
      participants: allParticipants as any,
      groupName: data.groupName,
      groupAdmin: userId as any,
    });

    await chat.populate('participants', 'username profilePicture email');

    const roomName = `chat:${chat._id.toString()}`;
    for (const participantId of data.participantIds) {
      socketGateway.emitToUser(participantId, SocketEvents.GROUP_CREATED, {
        chat,
        roomName,
      });
    }

    return chat;
  }

  async sendGroupMessage(userId: string, chatId: string, data: SendMessageInput) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Chat not found');
    }

    if (chat.type !== 'group') {
      throw new AppException(StatusCodes.BAD_REQUEST, 'This is not a group chat');
    }

    if (!chat.participants.some((p) => p.toString() === userId)) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You are not a member of this group');
    }

    const message = await this.chatRepository.createMessage({
      chatId: chatId as any,
      senderId: userId as any,
      content: data.content,
      type: data.type || 'text',
      fileUrl: data.fileUrl,
      readBy: [userId as any],
    });

    chat.lastMessage = message._id as any;
    chat.lastMessageAt = new Date();
    await chat.save();

    await message.populate('senderId', 'username profilePicture');

    const roomName = `chat:${chatId}`;
    socketGateway.emitToRoom(roomName, SocketEvents.GROUP_MESSAGE, {
      chatId,
      message,
    });

    return message;
  }

  async getUserChats(userId: string) {
    const chats = await this.chatRepository.getUserChats(userId);
    return { chats };
  }
}
