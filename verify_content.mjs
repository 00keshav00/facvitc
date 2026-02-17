import mongoose from 'mongoose';
// Assuming default connection string or set ENV manually if needed
const MONGODB_URI = 'mongodb://localhost:27017/artclub'; 

const PageContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  timeline: [{
    year: String,
    title: String,
    description: String,
    images: [String]
  }]
}, { strict: false });

const PageContent = mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);

async function check() {
  console.log('Connecting to DB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');
  
  const pages = await PageContent.find({}, 'page');
  console.log('Pages found:', pages.map(p => p.page));
  
  const workshops = await PageContent.findOne({ page: 'workshops' });
  if (workshops) {
    console.log('Workshops page found:', JSON.stringify(workshops, null, 2));
  } else {
    console.log('Workshops page NOT found.');
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
