import { BaseRepository } from '../../shared/base.repository';
import { User, IUser } from './user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).select('+password +tokens +otp +otpExpiry').exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await this.model.findOne({ username }).exec();
  }

  async addToken(userId: string, token: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { $push: { tokens: token } }).exec();
  }

  async removeToken(userId: string, token: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { $pull: { tokens: token } }).exec();
  }
}
