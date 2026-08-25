import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    phone: { type: String },
    clinicName: { type: String },
    city: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    resetOtpHash: { type: String },
    resetOtpExpires: { type: Date },
    pendingEmail: { type: String },
    pendingEmailOtpHash: { type: String },
    pendingEmailOtpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);