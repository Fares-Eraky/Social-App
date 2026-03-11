import { BaseRepository } from '../../shared/base.repository';
import { Chat, IChat } from './chat.model';
import { Message, IMessage } from './message.model';

export class ChatRepository extends BaseRepository<IChat> {
  constructor() {
    super(Chat);
  }

  async findChatByParticipants(userId1: string, userId2: string): Promise<IChat | null> {
    return await this.model
      .findOne({
        type: 'one-on-one',
        participants: { $all: [userId1, userId2], $size: 2 },
      })
      .exec();
  }

  async getUserChats(userId: string) {
    return await this.model
      .find({ participants: userId })
      .populate('participants', 'username profilePicture')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async getPaginatedMessages(chatId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Message.countDocuments({ chatId });

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createMessage(data: Partial<IMessage>): Promise<IMessage> {
    const message = new Message(data);
    return await message.save();
  }
}
