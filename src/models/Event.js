import mongoose from 'mongoose';

const EventYearSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['TechnoVit', 'Vibrance', 'Workshops', 'Others'], required: true },
  year: { type: String, required: true },
  title: String,
  description: String,
  enabled: { type: Boolean, default: true },
  sections: [{
    title: String,
    description: String,
    mainImage: String,
    subImages: [String],
    video: String,
    layout: { 
      type: String, 
      enum: ['TEXT_LEFT_IMAGE_RIGHT', 'TEXT_RIGHT_IMAGE_LEFT', 'IMAGE_ONLY', 'SPLIT_WITH_STACK', 'SPLIT_WITH_STACK_REVERSE'],
      default: 'TEXT_LEFT_IMAGE_RIGHT'
    },
    order: Number
  }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.EventYear || mongoose.model('EventYear', EventYearSchema);
