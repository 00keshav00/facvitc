import mongoose from 'mongoose';

const PageContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true }, // e.g., "home", "about"
  hero: {
    title: String,
    subtitle: String,
    backgroundImage: String,
    ctaText: String,
    ctaLink: String,
  },
  about: {
    title: String,
    text: String,
    images: [String], // Array of image URLs
    video: String,
  },
  gallery: {
    title: String,
    featuredArtwork: {
      image: String,
      title: String,
      description: String,
      artist: String,
    },
    sliderImages: [{
      name: String, // e.g., "games", "anime"
      image: String,
      link: String,
    }],
  },
  events: [{
      title: String,
      description: String,
      imageLeft: String,
      imageRight: String,
      link: String,
      linkText: String
  }],
  contact: {
      title: String,
      text: String,
      socials: [{
          platform: String,
          link: String,
          icon: String
      }]
  },
  timeline: [{
    year: String,
    title: String,
    description: String,
    images: [String]
  }]
});

export default mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);
