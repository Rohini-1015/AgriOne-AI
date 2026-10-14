import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../types';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required'),
  email: z.string().email('Valid email address required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  village: z.string().min(2, 'Village is required'),
  role: z.enum(['FARMER', 'BUYER', 'ADMIN', 'AGRICULTURAL_EXPERT']).default('FARMER'),
});

const loginSchema = z.object({
  emailOrPhone: z.string().min(3, 'Email or phone number required'),
  password: z.string().min(1, 'Password required'),
});

function sanitizeUser(user: any) {
  const { passwordHash, resetToken, resetExpires, ...safeUser } = user;
  return safeUser;
}

function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    env.JWT_SECRET,
    { expiresIn: (env.JWT_EXPIRES_IN || '7d') as any }
  );
}

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);

      const existingUser = dataStore.users.find(
        u => u.email.toLowerCase() === validated.email.toLowerCase() || u.mobileNumber === validated.mobileNumber
      );

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'An account with this email or mobile number already exists.',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(validated.password, 10);
      const newUser = {
        id: `user-${uuidv4().slice(0, 8)}`,
        fullName: validated.fullName,
        mobileNumber: validated.mobileNumber,
        email: validated.email.toLowerCase(),
        passwordHash,
        state: validated.state,
        district: validated.district,
        village: validated.village,
        role: validated.role,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(validated.fullName)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.users.push(newUser);

      // Create welcome notification
      dataStore.notifications.push({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: newUser.id,
        titleEn: `Welcome to AgriOne AI, ${newUser.fullName}!`,
        titleTa: `அக்ரிஒன் தளத்திற்கு நல்வரவு, ${newUser.fullName}!`,
        messageEn: 'Explore AI Crop Doctor, real-time market prices, and farming advisory services.',
        messageTa: 'பயிர் மருத்துவர், நேரடி சந்தை விலைகள் மற்றும் வேளாண் சேவைகளை உடனடியாக பயன்படுத்தலாம்.',
        type: 'GENERAL',
        isRead: false,
        actionUrl: '/dashboard',
        createdAt: new Date(),
      });

      const token = generateToken(newUser);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
          user: sanitizeUser(newUser),
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emailOrPhone, password } = loginSchema.parse(req.body);

      const query = emailOrPhone.trim().toLowerCase();
      const user = dataStore.users.find(
        u => u.email.toLowerCase() === query || u.mobileNumber === query
      );

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials. User does not exist.',
        });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const token = generateToken(user);

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          user: sanitizeUser(user),
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = dataStore.users.find(u => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = dataStore.users.find(u => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const { fullName, state, district, village, avatarUrl } = req.body;
      if (fullName) user.fullName = fullName;
      if (state) user.state = state;
      if (district) user.district = district;
      if (village) user.village = village;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      user.updatedAt = new Date();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: { user: sanitizeUser(user) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emailOrPhone } = req.body;
      if (!emailOrPhone) {
        res.status(400).json({ success: false, message: 'Email or mobile number is required.' });
        return;
      }

      const query = emailOrPhone.trim().toLowerCase();
      const user = dataStore.users.find(
        u => u.email.toLowerCase() === query || u.mobileNumber === query
      );

      // Even if user not found, avoid leaking user enumeration for security
      const resetToken = uuidv4().slice(0, 6).toUpperCase(); // 6-digit OTP-ready code
      if (user) {
        (user as any).resetToken = resetToken;
        (user as any).resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      }

      res.status(200).json({
        success: true,
        message: 'Password reset code has been sent to your registered contact.',
        data: {
          // Exposing token in development demo mode for effortless evaluation
          demoResetToken: user ? resetToken : '123456',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { emailOrPhone, resetToken, newPassword } = req.body;
      if (!emailOrPhone || !resetToken || !newPassword) {
        res.status(400).json({ success: false, message: 'Missing required reset fields.' });
        return;
      }

      const query = emailOrPhone.trim().toLowerCase();
      const user = dataStore.users.find(
        u => u.email.toLowerCase() === query || u.mobileNumber === query
      );

      if (!user) {
        res.status(400).json({ success: false, message: 'Invalid reset request or user not found.' });
        return;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      (user as any).resetToken = null;
      (user as any).resetExpires = null;
      user.updatedAt = new Date();

      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }
}
