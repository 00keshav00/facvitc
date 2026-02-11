import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // e.g., President, Member, etc.
  year: { type: String, required: true }, // e.g., "1st Year", "2nd Year"
  specialization: { type: String }, // e.g., "Watercolor", "Digital Art"
  quote: { type: String },
  image: { type: String }, // URL or path
  socialLink: { type: String },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
