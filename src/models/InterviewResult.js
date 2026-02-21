import mongoose from 'mongoose';

const InterviewResultSchema = new mongoose.Schema({
  department: { type: String, required: true },
  logo: { type: String }, // URL to the image logo
  order: { type: Number, default: 0 },
  selectedMembers: [{
    name: { type: String, required: true },
    regno: { type: String, required: true }
  }]
}, { timestamps: true });

export default mongoose.models.InterviewResult || mongoose.model('InterviewResult', InterviewResultSchema);
