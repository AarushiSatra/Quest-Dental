import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    detail: { type: String },
    icon: { type: String, default: 'ti-settings' },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);