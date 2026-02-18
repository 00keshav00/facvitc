import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., President, Member, etc.
  type: { type: String, enum: ['Lead', 'General'], default: 'General' },
  year: { type: String }, // optional for lead
  department: { type: String },
  bio: { type: String },
  image: { type: String }, // URL or path
  socialLinks: {
    instagram: String,
    facebook: String,
    linkedin: String
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
