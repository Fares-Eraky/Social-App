import { BaseRepository } from '../../shared/base.repository';
import { FriendRequest, IFriendRequest } from './friend.model';

export class FriendRepository extends BaseRepository<IFriendRequest> {
  constructor() {
    super(FriendRequest);
  }

  async findPendingRequests(userId: string) {
    return await this.model
      .find({ receiverId: userId, status: 'pending' })
      .populate('senderId', 'username profilePicture email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAcceptedFriends(userId: string) {
    const sentRequests = await this.model
      .find({ senderId: userId, status: 'accepted' })
      .populate('receiverId', 'username profilePicture email')
      .exec();

    const receivedRequests = await this.model
      .find({ receiverId: userId, status: 'accepted' })
      .populate('senderId', 'username profilePicture email')
      .exec();

    const friends = [
      ...sentRequests.map((req) => req.receiverId),
      ...receivedRequests.map((req) => req.senderId),
    ];

    return friends;
  }

  async findExistingRequest(senderId: string, receiverId: string) {
    return await this.model.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).exec();
  }

  async areFriends(userId1: string, userId2: string): Promise<boolean> {
    const friendship = await this.model.findOne({
      $or: [
        { senderId: userId1, receiverId: userId2, status: 'accepted' },
        { senderId: userId2, receiverId: userId1, status: 'accepted' },
      ],
    }).exec();

    return !!friendship;
  }
}
