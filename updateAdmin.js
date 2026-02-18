import dbConnect from './src/lib/db.js';
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function updateAdminCredentials() {
  await dbConnect();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL or ADMIN_PASSWORD not found in .env.local');
    mongoose.connection.close();
    return;
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('Generated Hashed Password:', hashedPassword);

    // Find and update the admin user, or create if not found
    const updatedUser = await User.findOneAndUpdate(
      { role: 'admin' }, 
      { email: adminEmail, password: hashedPassword },
      { upsert: true, new: true, runValidators: true }
    );

    console.log('Admin credentials updated successfully!');
    console.log('New Admin Email:', updatedUser.email);

  } catch (error) {
    console.error('Error updating admin credentials:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateAdminCredentials();
