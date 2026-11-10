import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required.'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Answer is required.'],
      trim: true
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
      validate: { validator: Number.isSafeInteger, message: 'Order must be a non-negative integer.' }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

faqSchema.index({ order: 1, createdAt: 1 });

export const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
