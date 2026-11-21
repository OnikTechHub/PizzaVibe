import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { sendEmail } from '../config/email.js';
import { protect, AuthRequest } from '../middlewares/auth.middleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pizzavibe_jwt_secret_dev_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Generate JWT token for an authenticated user
 */
const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Generate 6-digit numeric OTP code
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * HTML Email Template for 6-Digit Registration OTP Verification
 */
const generateOtpEmailHtml = (name: string, otp: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 28px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #fecaca; margin: 6px 0 0; font-size: 13px; font-weight: 500; }
    .content { padding: 32px; text-align: center; }
    .greeting { font-size: 16px; color: #334155; margin-bottom: 12px; }
    .instruction { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #fff1f2; border: 2px dashed #f87171; border-radius: 16px; padding: 20px 24px; margin: 0 auto 24px auto; display: inline-block; }
    .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #dc2626; font-family: 'Courier New', Courier, monospace; margin: 0; }
    .validity { font-size: 12px; color: #94a3b8; margin-top: 8px; }
    .footer { padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 PizzaVibe</h1>
      <p>Artisan Sourdough & Kitchen</p>
    </div>
    <div class="content">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <p class="instruction">
        Thank you for joining PizzaVibe! Please use the 6-digit verification code below to verify your email address and activate your account:
      </p>
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
        <p class="validity">&bull; Valid for 10 minutes &bull;</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
        If you did not request this registration, you can safely ignore this email. Never share your verification code with anyone.
      </p>
    </div>
    <div class="footer">
      PizzaVibe Kitchen &bull; GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh<br>
      Direct Support: onikdas.dev@gmail.com | +880 1828347761
    </div>
  </div>
</body>
</html>
`;
};

/**
 * HTML Email Template for OTP Password Reset
 */
const generateForgotOtpEmailHtml = (name: string, otp: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 28px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { color: #fecaca; margin: 6px 0 0; font-size: 13px; font-weight: 500; }
    .content { padding: 32px; text-align: center; }
    .greeting { font-size: 16px; color: #334155; margin-bottom: 12px; }
    .instruction { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
    .otp-box { background: #fff1f2; border: 2px dashed #f87171; border-radius: 16px; padding: 20px 24px; margin: 0 auto 24px auto; display: inline-block; }
    .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #dc2626; font-family: 'Courier New', Courier, monospace; margin: 0; }
    .validity { font-size: 12px; color: #94a3b8; margin-top: 8px; }
    .footer { padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 PizzaVibe Password Reset</h1>
      <p>Artisan Kitchen Security</p>
    </div>
    <div class="content">
      <p class="greeting">Hello <strong>${name}</strong>,</p>
      <p class="instruction">
        We received a request to reset your PizzaVibe password. Use the 6-digit verification code below to verify your account and set a new password:
      </p>
      <div class="otp-box">
        <p class="otp-code">${otp}</p>
        <p class="validity">&bull; Valid for 10 minutes &bull;</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
        If you did not request a password reset, you can safely ignore this email. Never share this code with anyone.
      </p>
    </div>
    <div class="footer">
      PizzaVibe Kitchen &bull; GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh<br>
      Direct Support: onikdas.dev@gmail.com
    </div>
  </div>
</body>
</html>
`;
};

/**
 * HTML Email Template for Password Reset Link (Fallback)
 */
const generateResetEmailHtml = (name: string, resetUrl: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); padding: 28px 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .content { padding: 32px; text-align: center; }
    .button { display: inline-block; background-color: #dc2626; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 9999px; text-decoration: none; margin: 20px 0; }
    .footer { padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 PizzaVibe Password Reset</h1>
    </div>
    <div class="content">
      <p style="font-size: 15px; color: #334155;">Hello <strong>${name}</strong>,</p>
      <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
        We received a request to reset the password for your PizzaVibe account. Click the button below to choose a new password:
      </p>
      <div>
        <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
        This password reset link will expire in <strong>1 hour</strong>.<br>
        If you did not request a password reset, no further action is required and your account remains secure.
      </p>
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #94a3b8; word-break: break-all;">
        Button not working? Copy and paste this URL into your browser:<br>
        <a href="${resetUrl}" style="color: #dc2626;">${resetUrl}</a>
      </div>
    </div>
    <div class="footer">
      PizzaVibe Kitchen &bull; GEC Circle, CDA Avenue, Chattogram 4000, Bangladesh
    </div>
  </div>
</body>
</html>
`;
};

/**
 * @route   POST /api/auth/register
 * @desc    Step 1: Register customer credentials & dispatch 6-digit OTP to email
 * @access  Public
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (at least 2 characters).',
      });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : '';

    // Check if an existing verified user already has this email
    const existingUser = await User.findOne({ email: cleanEmail }).select('+password');
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Generate 6-digit OTP code and set 10-minute expiration
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      // User previously registered but didn't verify OTP: update credentials and fresh OTP
      existingUser.name = cleanName;
      existingUser.password = password;
      existingUser.phone = cleanPhone;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.role = 'customer';
      await existingUser.save();
    } else {
      // Create fresh unverified customer user
      await User.create({
        name: cleanName,
        email: cleanEmail,
        password,
        phone: cleanPhone,
        role: 'customer',
        isVerified: false,
        otp,
        otpExpires,
      });
    }

    // Send OTP email via Nodemailer
    await sendEmail({
      to: cleanEmail,
      subject: `Your PizzaVibe Verification Code: ${otp}`,
      html: generateOtpEmailHtml(cleanName, otp),
      text: `Hello ${cleanName},\n\nYour 6-digit PizzaVibe verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nWarm regards,\nPizzaVibe Kitchen`,
    });

    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email. Please verify to activate your account.',
      email: cleanEmail,
    });
  } catch (error: unknown) {
    console.error('[Register Error]:', error);
    const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Step 2: Verify 6-digit OTP, activate account, and issue session JWT
 * @access  Public
 */
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit verification code are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail }).select('+otp +otpExpires');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please register first.',
      });
    }

    if (user.isVerified) {
      const token = generateToken(user._id.toString(), user.role);
      return res.status(200).json({
        success: true,
        message: 'Account is already verified. You are logged in.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    }

    // Check OTP match
    if (!user.otp || user.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.',
      });
    }

    // Check OTP expiration
    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please click "Resend Code" to receive a new one.',
      });
    }

    // Mark as verified & clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to PizzaVibe.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: unknown) {
    console.error('[Verify OTP Error]:', error);
    const message = error instanceof Error ? error.message : 'OTP verification failed';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend a fresh 6-digit OTP code to unverified user
 * @access  Public
 */
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select('+otp +otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please register first.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified. Please log in directly.',
      });
    }

    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: cleanEmail,
      subject: `Your New PizzaVibe Verification Code: ${newOtp}`,
      html: generateOtpEmailHtml(user.name, newOtp),
      text: `Hello ${user.name},\n\nYour new PizzaVibe verification code is: ${newOtp}\n\nValid for 10 minutes.`,
    });

    return res.status(200).json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
    });
  } catch (error: unknown) {
    console.error('[Resend OTP Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to resend OTP';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate customer or admin and return JWT
 * @access  Public
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select('+password +otp +otpExpires');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is verified
    if (!user.isVerified) {
      // Automatically send a fresh OTP to help user complete registration
      const freshOtp = generateOtp();
      user.otp = freshOtp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendEmail({
        to: cleanEmail,
        subject: `Verify Your PizzaVibe Account: ${freshOtp}`,
        html: generateOtpEmailHtml(user.name, freshOtp),
        text: `Your PizzaVibe verification code is: ${freshOtp}`,
      });

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: 'Your email address is not verified yet. We have sent a new 6-digit verification code to your email.',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: unknown) {
    console.error('[Login Error]:', error);
    const message = error instanceof Error ? error.message : 'Login failed';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/auth/google/url
 * @desc    Generate Google OAuth URL with prompt=select_account
 * @access  Public
 */
router.get('/google/url', (_req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  if (!clientId) {
    return res.status(400).json({
      success: false,
      message: 'GOOGLE_CLIENT_ID is not configured in server .env. Please configure your Google OAuth credentials.',
    });
  }

  const redirectUri = `${CLIENT_URL}/auth/callback/google`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&prompt=select_account&access_type=offline`;

  return res.json({ success: true, url });
});

/**
 * @route   POST /api/auth/google/callback
 * @desc    Exchange Google OAuth code for tokens, fetch user profile, and login/register customer
 * @access  Public
 */
router.post('/google/callback', async (req: Request, res: Response) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'OAuth authorization code is required' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        message: 'Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) missing on server.',
      });
    }

    const effectiveRedirectUri = redirectUri || `${CLIENT_URL}/auth/callback/google`;

    // 1. Exchange authorization code with Google token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: effectiveRedirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = (await tokenResponse.json()) as any;

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google Token Exchange Error]:', tokenData);
      return res.status(400).json({
        success: false,
        message: tokenData.error_description || 'Failed to exchange authorization code with Google.',
      });
    }

    // 2. Fetch authenticated user profile from Google UserInfo endpoint
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = (await userinfoResponse.json()) as any;

    if (!userinfoResponse.ok || !profile.email) {
      return res.status(400).json({
        success: false,
        message: 'Failed to retrieve profile information from Google account.',
      });
    }

    const cleanEmail = profile.email.trim().toLowerCase();
    const cleanName = profile.name ? profile.name.trim() : cleanEmail.split('@')[0];
    const googleId = profile.sub || '';

    // 3. Find existing user or register new customer
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      if (!user.isVerified) user.isVerified = true;
      if (googleId && !user.googleId) user.googleId = googleId;
      await user.save();
    } else {
      const randomPassword = crypto.randomBytes(24).toString('hex');
      user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: randomPassword,
        role: 'customer',
        isVerified: true,
        googleId,
      });
    }

    // 4. Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      success: true,
      message: `Signed in with Google successfully as ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: unknown) {
    console.error('[Google Callback Error]:', error);
    const message = error instanceof Error ? error.message : 'Google OAuth processing failed';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate or register customer via Google Sign-In
 * @access  Public
 */
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { name, email, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google email is required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name ? name.trim() : cleanEmail.split('@')[0];

    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // Existing user: ensure marked verified since Google authenticated it
      if (!user.isVerified) {
        user.isVerified = true;
      }
      if (googleId && !user.googleId) {
        user.googleId = googleId;
      }
      await user.save();
    } else {
      // New user from Google Sign-In: create with role customer and verified true
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: randomPassword,
        role: 'customer',
        isVerified: true,
        googleId: googleId || '',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      success: true,
      message: 'Signed in with Google successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error: unknown) {
    console.error('[Google Sign-In Error]:', error);
    const message = error instanceof Error ? error.message : 'Google sign-in failed';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Step 1: Check user email, generate 6-digit OTP, save to DB and send via Nodemailer
 * @access  Public
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No PizzaVibe account found with this email address.',
      });
    }

    // Generate 6-digit numeric OTP code and set 10-minute expiration
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendEmail({
      to: cleanEmail,
      subject: `Your PizzaVibe Password Reset Code: ${otp}`,
      html: generateForgotOtpEmailHtml(user.name, otp),
      text: `Hello ${user.name},\n\nYour 6-digit PizzaVibe password reset code is: ${otp}\n\nValid for 10 minutes.\n\nWarm regards,\nPizzaVibe Kitchen`,
    });

    return res.json({
      success: true,
      message: 'A 6-digit verification code has been dispatched to your email.',
      email: cleanEmail,
    });
  } catch (error: unknown) {
    console.error('[Forgot Password Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to dispatch reset code';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/resend-forgot-otp
 * @desc    Resend fresh 6-digit OTP for password reset
 * @access  Public
 */
router.post('/resend-forgot-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address.' });
    }

    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: cleanEmail,
      subject: `Your New PizzaVibe Password Reset Code: ${newOtp}`,
      html: generateForgotOtpEmailHtml(user.name, newOtp),
      text: `Hello ${user.name},\n\nYour new PizzaVibe password reset code is: ${newOtp}\n\nValid for 10 minutes.`,
    });

    return res.json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
    });
  } catch (error: unknown) {
    console.error('[Resend Forgot OTP Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to resend reset code';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Step 2/3: Verify 6-digit OTP and update password in MongoDB
 * @access  Public
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, token, password } = req.body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    let user;

    // 1. Primary: 6-digit OTP verification flow
    if (email && otp) {
      const cleanEmail = email.trim().toLowerCase();
      const cleanOtp = String(otp).trim();

      user = await User.findOne({ email: cleanEmail }).select('+password +otp +otpExpires');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Account not found with this email address.',
        });
      }

      if (!user.otp || user.otp !== cleanOtp) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code. Please check your email and try again.',
        });
      }

      if (!user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Verification code has expired. Please request a new code.',
        });
      }
    } else if (token) {
      // 2. Fallback: Token-based link verification
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      }).select('+password');

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Password reset link is invalid or has expired. Please request a new one.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email and 6-digit verification code are required.',
      });
    }

    // Hash and update password (pre-save hook will hash it)
    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: 'Your password has been successfully updated! You can now log in.',
    });
  } catch (error: unknown) {
    console.error('[Reset Password Error]:', error);
    const message = error instanceof Error ? error.message : 'Password reset failed';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    return res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        addresses: req.user.addresses,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    return res.status(500).json({ success: false, message });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user's profile details (Name, Phone)
 * @access  Private
 */
router.put('/profile', protect, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, phone } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters long.',
        });
      }
      req.user.name = name.trim();
    }

    if (phone !== undefined) {
      req.user.phone = typeof phone === 'string' ? phone.trim() : '';
    }

    await req.user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        addresses: req.user.addresses,
      },
    });
  } catch (error: unknown) {
    console.error('[Update Profile Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return res.status(500).json({ success: false, message });
  }
});

// Also alias /me to /profile update for standard REST semantics
router.put('/me', protect, async (req: AuthRequest, res: Response) => {
  // Re-use logic from /profile
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, phone } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters long.',
        });
      }
      req.user.name = name.trim();
    }

    if (phone !== undefined) {
      req.user.phone = typeof phone === 'string' ? phone.trim() : '';
    }

    await req.user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        addresses: req.user.addresses,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    return res.status(500).json({ success: false, message });
  }
});

export default router;
