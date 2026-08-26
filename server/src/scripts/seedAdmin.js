const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { connectDB, disconnectDB } = require('../config/db');

/**
 * CLI Script to Seed/Provision the Admin Account
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=Secret123! node src/scripts/seedAdmin.js
 *   or: node src/scripts/seedAdmin.js --email=admin@example.com --password=Secret123!
 *   or: node src/scripts/seedAdmin.js --email admin@example.com --password Secret123!
 */
const seedAdmin = async () => {
  try {
    // Parse CLI arguments if provided
    const args = process.argv.slice(2);
    let emailArg = process.env.ADMIN_EMAIL;
    let passwordArg = process.env.ADMIN_PASSWORD;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('--email=')) {
        emailArg = arg.slice('--email='.length);
      } else if ((arg === '--email' || arg === '-e') && args[i + 1]) {
        emailArg = args[++i];
      } else if (arg.startsWith('--password=')) {
        passwordArg = arg.slice('--password='.length);
      } else if ((arg === '--password' || arg === '-p') && args[i + 1]) {
        passwordArg = args[++i];
      }
    }

    if (!emailArg || !passwordArg) {
      console.error('Error: Both email and password are required to seed an admin account.');
      console.error('Usage: node src/scripts/seedAdmin.js --email=<email> --password=<password>');
      process.exit(1);
    }

    const normalizedEmail = emailArg.trim().toLowerCase();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.error('Error: Please enter a valid email address.');
      process.exit(1);
    }

    if (passwordArg.length < 8) {
      console.error('Error: Admin password must be at least 8 characters long for security.');
      process.exit(1);
    }

    console.log('[Seed] Connecting to MongoDB database...');
    await connectDB();

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(passwordArg, salt);

    let admin = await Admin.findOne({ email: normalizedEmail });

    if (admin) {
      admin.passwordHash = passwordHash;
      admin.failedLoginAttempts = 0;
      admin.lockUntil = null;
      admin.refreshTokenHash = null;
      if (admin.authProvider === 'google') {
        admin.authProvider = 'both';
      }
      await admin.save();
      console.log(`[Seed] Successfully updated existing Admin account: ${normalizedEmail}`);
    } else {
      admin = await Admin.create({
        email: normalizedEmail,
        passwordHash,
        avatarUrl: '/ME.jpg',
        authProvider: 'local',
        failedLoginAttempts: 0,
        lockUntil: null,
      });
      console.log(`[Seed] Successfully created new Admin account: ${normalizedEmail}`);
    }

    console.log('----------------------------------------------------');
    console.log(`Admin Email    : ${admin.email}`);
    console.log(`Admin ID       : ${admin._id}`);
    console.log(`Admin Password : ${passwordArg}`);
    console.log('----------------------------------------------------');

    await disconnectDB();
    console.log('[Seed] Seed script finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
