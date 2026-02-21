import mongoose from 'mongoose';

const FFCSSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regno: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.models.FFCS || mongoose.model('FFCS', FFCSSchema);
