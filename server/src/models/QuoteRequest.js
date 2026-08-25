import mongoose from 'mongoose';

const quoteRequestSchema = new mongoose.Schema(
  {
    clinicName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    productInterest: { type: String },
    productName: { type: String },
    serviceInterest: { type: String },
    serviceName: { type: String },
    preferredDate: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model('QuoteRequest', quoteRequestSchema);