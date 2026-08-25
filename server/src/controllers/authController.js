import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { sendOtpEmail } from '../config/mailer.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || null,
    phone: user.phone || '',
    clinicName: user.clinicName || '',
    city: user.city || '',
    role: user.role || 'customer',
  };
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ token: signToken(user), user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: signToken(user), user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/google
// Body: { credential } — the ID token returned by Google Identity Services
// on the frontend (@react-oauth/google GoogleLogin component).
export async function googleAuth(req, res, next) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        avatar: payload.picture,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      user.avatar = user.avatar || payload.picture;
      await user.save();
    }

    res.json({ token: signToken(user), user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/me
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, clinicName, city } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (clinicName !== undefined) user.clinicName = clinicName;
    if (city !== undefined) user.city = city;

    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /api/auth/change-email/request-otp — sends a code to the NEW
// email address, to verify the user actually owns it.
export async function requestEmailChangeOtp(req, res, next) {
  try {
    const { newEmail } = req.body;
    if (!newEmail) return res.status(400).json({ message: 'New email is required' });

    const normalized = newEmail.toLowerCase();
    const existing = await User.findOne({ email: normalized });
    if (existing && String(existing._id) !== String(req.user.id)) {
      return res.status(409).json({ message: 'That email is already in use' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.pendingEmail = normalized;
    user.pendingEmailOtpHash = await bcrypt.hash(otp, 10);
    user.pendingEmailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOtpEmail(normalized, otp);

    res.json({ message: 'Code sent to your new email address' });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/change-email — verifies the code and applies the change.
export async function changeEmail(req, res, next) {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.pendingEmail || !user.pendingEmailOtpHash || !user.pendingEmailOtpExpires) {
      return res.status(400).json({ message: 'Request a code first' });
    }
    if (user.pendingEmailOtpExpires < new Date()) {
      return res.status(400).json({ message: 'This code has expired — request a new one' });
    }
    const match = await bcrypt.compare(otp || '', user.pendingEmailOtpHash);
    if (!match) return res.status(400).json({ message: 'Invalid code' });

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.pendingEmailOtpHash = undefined;
    user.pendingEmailOtpExpires = undefined;
    await user.save();

    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/change-password/request-otp — sends a code to the
// user's current account email.
export async function requestPasswordChangeOtp(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.resetOtpHash = await bcrypt.hash(otp, 10);
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendOtpEmail(user.email, otp);

    res.json({ message: 'Code sent to your email' });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/change-password — verifies the code and sets the new password.
export async function changePassword(req, res, next) {
  try {
    const { otp, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'Request a code first' });
    }
    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'This code has expired — request a new one' });
    }
    const match = await bcrypt.compare(otp || '', user.resetOtpHash);
    if (!match) return res.status(400).json({ message: 'Invalid code' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password — generates a 6-digit OTP, stores its
// hash with a 10-minute expiry, and emails it to the user. Always
// responds with a generic success message so this endpoint can't be
// used to check which emails have accounts.
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });

    if (user) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.resetOtpHash = await bcrypt.hash(otp, 10);
      user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOtpEmail(user.email, otp);
    }

    res.json({ message: 'If that email has an account, a code has been sent.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password — verifies the OTP and sets a new password.
export async function resetPassword(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Email, code and a new password (6+ characters) are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }
    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: 'This code has expired — request a new one' });
    }

    const match = await bcrypt.compare(otp, user.resetOtpHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOtpHash = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
}