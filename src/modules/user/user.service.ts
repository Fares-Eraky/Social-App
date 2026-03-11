import { UserRepository } from './user.repository';
import { SignupInput, LoginInput, ConfirmEmailInput } from './user.validation';
import { AppException } from '../../utils/exception.class';
import { StatusCodes } from '../../shared/constants/status-codes';
import { generateOTP, verifyOTP, getOTPExpiry } from '../../utils/otp.util';
import { sendOTPEmail } from '../../utils/email.util';
import { generateToken } from '../../utils/jwt.util';
import { comparePassword } from '../../utils/hash.util';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(data: SignupInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppException(StatusCodes.CONFLICT, 'Email already registered');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new AppException(StatusCodes.CONFLICT, 'Username already taken');
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    const user = await this.userRepository.create({
      ...data,
      otp,
      otpExpiry,
    });

    await sendOTPEmail(data.email, otp);

    return {
      message: 'User registered successfully. Please check your email for verification code.',
      userId: user._id,
    };
  }

  async confirmEmail(data: ConfirmEmailInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppException(StatusCodes.NOT_FOUND, 'User not found');
    }

    if (user.isEmailConfirmed) {
      throw new AppException(StatusCodes.BAD_REQUEST, 'Email already confirmed');
    }

    if (!user.otp || !user.otpExpiry) {
      throw new AppException(StatusCodes.BAD_REQUEST, 'No OTP found. Please request a new one.');
    }

    if (!verifyOTP(data.otp, user.otp, user.otpExpiry)) {
      throw new AppException(StatusCodes.BAD_REQUEST, 'Invalid or expired OTP');
    }

    await this.userRepository.update(user._id.toString(), {
      isEmailConfirmed: true,
      otp: undefined,
      otpExpiry: undefined,
    } as any);

    return { message: 'Email confirmed successfully' };
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'Please confirm your email first');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppException(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      signatureLevel: user.signatureLevel,
    });

    await this.userRepository.addToken(user._id.toString(), token);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  async logout(userId: string, token: string) {
    await this.userRepository.removeToken(userId, token);
    return { message: 'Logged out successfully' };
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppException(StatusCodes.NOT_FOUND, 'User not found');
    }

    return {
      id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      role: user.role,
      isEmailConfirmed: user.isEmailConfirmed,
      createdAt: user.createdAt,
    };
  }
}
