import mongoose from 'mongoose';

const HomeSchema = new mongoose.Schema({
  hero: {
    logo: String,
    heading: String,
    subheading: String
  },
  about: {
    title: String,
    description: String,
    images: [String],
    video: String
  },
  artworkOfTheWeek: {
    title: String,
    subtitle: String,
    description: String,
    image: String,
    buttonLink: String
  },
  galleryPreview: [{
    title: String,
    image: String,
    frontImage: String,
    backImage: String
  }],
  eventsPreview: [{
    title: { type: String, required: true }, // Fixed: TechnoVit, Vibrance, Others
    imageA: String,
    imageB: String,
    description: String,
    link: String
  }],
  membersPreview: [{
    name: String,
    role: String,
    image: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    other: String,
    isFaculty: { type: Boolean, default: false },
    order: Number
  }],
  siteDesigners: [{
    name: String,
    linkedin: String,
    otherLink: String
  }],
  contact: {
    email: String,
    phone: String,
    address: String
  }
}, { timestamps: true });

export default mongoose.models.Home || mongoose.model('Home', HomeSchema);
