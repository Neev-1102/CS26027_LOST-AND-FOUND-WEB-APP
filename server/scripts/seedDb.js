import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Report from '../models/Report.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfind';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for database seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clear existing collections if desired
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('Cleared existing Users and Reports collections.');

    // Seed Users for each role
    const users = await User.create([
      {
        name: 'Student (24CS088)',
        email: '24cs088@charusat.edu.in',
        password: 'password123',
        role: 'student',
        department: 'Computer Engineering (CSPIT/DEPSTAR)',
        studentId: '24CS088',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        status: 'Active',
      },
      {
        name: 'Prof. R. K. Patel',
        email: 'prof.patel@charusat.edu.in',
        password: 'faculty123',
        role: 'faculty',
        department: 'Department of Computer Engineering',
        employeeId: 'FAC-CHARUSAT-102',
        phone: '+91 98765 12345',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        status: 'Active',
      },
      {
        name: 'CHARUSAT Security Admin',
        email: 'admin@charusat.edu.in',
        password: 'admin123',
        role: 'admin',
        department: 'CHARUSAT Campus Security & Student Affairs',
        employeeId: 'ADM-CHARUSAT-001',
        phone: '+91 99000 88000',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
        status: 'Active',
      },
    ]);

    console.log(`Created ${users.length} default user accounts:`);
    users.forEach(u => console.log(` - [${u.role.toUpperCase()}] ${u.name} <${u.email}>`));

    // Seed Sample Reports
    const reports = await Report.create([
      {
        type: 'lost',
        title: 'Apple MacBook Pro M2 (Space Gray)',
        category: 'Electronics',
        description: 'Left in Science Building Room 302 after 4 PM lecture. Has a blue developer sticker on top lid.',
        location: 'Science Building - Room 302',
        date: '2026-08-14',
        status: 'pending',
        reporterName: 'Student (24CS088)',
        reporterRole: 'student',
        reporterEmail: '24cs088@charusat.edu.in',
        reporterPhone: '+91 98765 43210',
        department: 'Computer Engineering (CSPIT/DEPSTAR)',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'],
      },
      {
        type: 'found',
        title: 'TI-84 Plus CE Graphing Calculator',
        category: 'Electronics',
        description: 'Found on podium desk in Engineering Hall Auditorium B. Handed over to Faculty Office.',
        location: 'Engineering Hall - Aud B',
        date: '2026-08-15',
        status: 'approved',
        reporterName: 'Prof. R. K. Patel',
        reporterRole: 'faculty',
        reporterEmail: 'prof.patel@charusat.edu.in',
        reporterPhone: '+91 98765 12345',
        department: 'Department of Computer Engineering',
        images: ['https://images.unsplash.com/photo-1611125832047-1d7ad1e8e49d?auto=format&fit=crop&q=80&w=600'],
      },
      {
        type: 'lost',
        title: 'Leather Wallet with CHARUSAT ID Card',
        category: 'Personal Belongings',
        description: 'Brown leather bi-fold wallet lost near the Student Center Cafeteria. Contains 24CS088 student ID card.',
        location: 'Student Union / Cafeteria',
        date: '2026-08-13',
        status: 'claimed',
        reporterName: 'Student (24CS088)',
        reporterRole: 'student',
        reporterEmail: '24cs088@charusat.edu.in',
        reporterPhone: '+91 98765 43210',
        department: 'Computer Engineering (CSPIT/DEPSTAR)',
        images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600'],
      },
      {
        type: 'found',
        title: 'Sony Noise-Canceling Wireless Headphones',
        category: 'Electronics',
        description: 'Black Sony WH-1000XM4 headphones turned into CHARUSAT Security Office.',
        location: 'Main Library 2nd Floor Study Desk',
        date: '2026-08-16',
        status: 'approved',
        reporterName: 'CHARUSAT Security Admin',
        reporterRole: 'admin',
        reporterEmail: 'admin@charusat.edu.in',
        reporterPhone: '+91 99000 88000',
        department: 'CHARUSAT Campus Security & Student Affairs',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
      },
    ]);

    console.log(`Created ${reports.length} sample Lost & Found reports in MongoDB.`);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

seedData();
