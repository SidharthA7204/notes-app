// server/scripts/seed-demo.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'demo@example.com';
const DEMO_NAME = 'Demo User';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ No MONGODB_URI found in server/.env');
    process.exit(1);
  }

  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅ Connected!');

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  const existing = await User.findOne({ email: DEMO_EMAIL });

  if (existing) {
    await User.updateOne({ email: DEMO_EMAIL }, { password: hashed, name: DEMO_NAME });
    console.log('✅ Demo account password reset!');
  } else {
    await User.create({ name: DEMO_NAME, email: DEMO_EMAIL, password: hashed });
    console.log('✅ Demo account created!');
  }

  console.log('\n🎉 Demo credentials:');
  console.log('   Email:    demo@example.com');
  console.log('   Password: password123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
