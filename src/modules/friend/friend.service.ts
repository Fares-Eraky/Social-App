import { FriendRepository } from './friend.repository';
import { SendRequestInput } from './friend.validation';
import { UserRepository } from '../user/user.repository';
import { AppException } from '../../utils/exception.class';
import { StatusCodes } from '../../shared/constants/status-codes';
import { socketGateway } from '../../socket/socket.gateway';
import { SocketEvents } from '../../socket/socket.events';

export class FriendService {
  private friendRepository: FriendRepository;
  private userRepository: UserRepository;

  constructor() {
    this.friendRepository = new FriendRepository();
    this.userRepository = new UserRepository();
  }

  async sendFriendRequest(senderId: string, data: SendRequestInput) {
    if (senderId === data.receiverId) {
      throw new AppException(StatusCodes.BAD_REQUEST, 'You cannot send a friend request to yourself');
    }

    const receiver = await this.userRepository.findById(data.receiverId);
    if (!receiver) {
      throw new AppException(StatusCodes.NOT_FOUND, 'User not found');
    }

    const existingRequest = await this.friendRepository.findExistingRequest(senderId, data.receiverId);
    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        throw new AppException(StatusCodes.CONFLICT, 'Friend request already sent');
      }
      if (existingRequest.status === 'accepted') {
        throw new AppException(StatusCodes.CONFLICT, 'You are already friends');
      }
    }

    const friendRequest = await this.friendRepository.create({
      senderId: senderId as any,
      receiverId: data.receiverId as any,
      status: 'pending',
    });

    const sender = await this.userRepository.findById(senderId);
    socketGateway.emitToUser(data.receiverId, SocketEvents.FRIEND_REQUEST_RECEIVED, {
      requestId: friendRequest._id,
      sender: {
        id: sender?._id,
        username: sender?.username,
        profilePicture: sender?.profilePicture,
      },
    });

    return {
      message: 'Friend request sent successfully',
      requestId: friendRequest._id,
    };
  }

  async acceptFriendRequest(userId: string, requestId: string) {
    const request = await this.friendRepository.findById(requestId);
    if (!request) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Friend request not found');
    }

    if (request.receiverId.toString() !== userId) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You can only accept requests sent to you');
    }

    if (request.status !== 'pending') {
      throw new AppException(StatusCodes.BAD_REQUEST, 'This request has already been processed');
    }

    await this.friendRepository.update(requestId, { status: 'accepted' } as any);

    const receiver = await this.userRepository.findById(userId);
    socketGateway.emitToUser(request.senderId.toString(), SocketEvents.FRIEND_REQUEST_ACCEPTED, {
      requestId,
      acceptedBy: {
        id: receiver?._id,
        username: receiver?.username,
        profilePicture: receiver?.profilePicture,
      },
    });

    socketGateway.emitToUser(userId, SocketEvents.FRIEND_REQUEST_ACCEPTED, {
      requestId,
      senderId: request.senderId,
    });

    return {
      message: 'Friend request accepted',
      senderId: request.senderId,
      receiverId: request.receiverId,
    };
  }

  async rejectFriendRequest(userId: string, requestId: string) {
    const request = await this.friendRepository.findById(requestId);
    if (!request) {
      throw new AppException(StatusCodes.NOT_FOUND, 'Friend request not found');
    }

    if (request.receiverId.toString() !== userId) {
      throw new AppException(StatusCodes.FORBIDDEN, 'You can only reject requests sent to you');
    }

    if (request.status !== 'pending') {
      throw new AppException(StatusCodes.BAD_REQUEST, 'This request has already been processed');
    }

    await this.friendRepository.update(requestId, { status: 'rejected' } as any);

    return { message: 'Friend request rejected' };
  }

  async getFriends(userId: string) {
    const friends = await this.friendRepository.findAcceptedFriends(userId);
    return { friends };
  }

  async getPendingRequests(userId: string) {
    const requests = await this.friendRepository.findPendingRequests(userId);
    return { requests };
  }
}
