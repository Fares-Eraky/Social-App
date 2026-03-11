import { Schema, model, Document, HydratedDocument } from 'mongoose';
import { hashPassword } from '../../utils/hash.util';
import { UserRole, SignatureLevel } from '../../shared/constants/roles';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  profilePicture?: string;
  isEmailConfirmed: boolean;
  otp?: string;
  otpExpiry?: Date;
  role: string;
  signatureLevel: number;
  tokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type HydratedUser = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    signatureLevel: {
      type: Number,
      default: SignatureLevel.BASIC,
    },
    tokens: {
      type: [String],
      select: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate() as any;
  if (update.password) {
    update.password = await hashPassword(update.password);
  }
  next();
});

export const User = model<IUser>('User', userSchema);
