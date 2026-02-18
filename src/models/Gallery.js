import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Digital Art', 'Sketch', 'Painting', 'Art for a Cause', 'Concept Art'],
    required: true 
  },
  image: { type: String, required: true },
  title: String,
  description: String,
  artist: String,
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
