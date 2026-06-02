import mongoose from 'mongoose';

const LeadYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.LeadYear || mongoose.model('LeadYear', LeadYearSchema);
