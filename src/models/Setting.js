import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  siteTitle: String,
  logo: String,
  favicon: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    linkedin: String
  },
  contactDetails: {
    email: String,
    phone: String,
    address: String
  },
  footerText: String
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
