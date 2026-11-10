import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  sessionIdHash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

export const AdminSession = mongoose.models.AdminSession || mongoose.model('AdminSession', adminSessionSchema);
