import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        'device',
        'attachment',
        'surgical',
        'clinical-hardware',
        'lab-equipment',
        'restorative',
        'storage-safety',
      ],
      required: true,
    },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    specs: [{ type: String }],
    useCases: [{ type: String }],
    certifications: [{ type: String }],
    badges: [{ type: String }],
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);