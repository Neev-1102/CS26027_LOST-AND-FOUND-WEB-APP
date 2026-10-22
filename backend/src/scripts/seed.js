import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Claim from '../models/Claim.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfind';

const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      LostItem.deleteMany({}),
      FoundItem.deleteMany({}),
      Claim.deleteMany({}),
      Category.deleteMany({}),
      AuditLog.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    // 1. Seed Users
    const student = await User.create({
      name: 'Neev Patel',
      email: 'student@charusat.edu.in',
      passwordHash: 'student123',
      role: 'student',
      department: 'Computer Engineering',
      collegeId: '24CS088',
      phone: '+91 98765 43210',
      accountStatus: 'active',
      avatar: null,
    });

    const staff = await User.create({
      name: 'Prof. R. K. Patel (Staff Desk)',
      email: 'staff@charusat.edu.in',
      passwordHash: 'staff123',
      role: 'staff',
      department: 'Campus Security & Lost Property Desk',
      collegeId: 'STF-CHARUSAT-102',
      phone: '+91 98765 12345',
      accountStatus: 'active',
      avatar: null,
    });

    const admin = await User.create({
      name: 'CHARUSAT Security Admin',
      email: 'admin@charusat.edu.in',
      passwordHash: 'admin123',
      role: 'admin',
      department: 'Student Affairs & Campus Administration',
      collegeId: 'ADM-CHARUSAT-001',
      phone: '+91 99000 88000',
      accountStatus: 'active',
      avatar: null,
    });

    console.log('Created Default User Accounts:');
    console.log(` - Student: student@charusat.edu.in / student123`);
    console.log(` - Staff:   staff@charusat.edu.in / staff123`);
    console.log(` - Admin:   admin@charusat.edu.in / admin123`);

    // 2. Seed Categories
    const categories = await Category.create([
      { name: 'Electronics', description: 'Laptops, smartphones, chargers, headphones', icon: 'Laptop', isActive: true },
      { name: 'ID Cards', description: 'Student IDs, driver licenses, library cards', icon: 'CreditCard', isActive: true },
      { name: 'Books & Notes', description: 'Textbooks, lab manuals, notebooks', icon: 'BookOpen', isActive: true },
      { name: 'Bags & Backpacks', description: 'School backpacks, pouches, luggage', icon: 'ShoppingBag', isActive: true },
      { name: 'Keys & Fobs', description: 'Hostel keys, bike/car keys', icon: 'Key', isActive: true },
      { name: 'Accessories', description: 'Watches, spectacles, jewelry, water bottles', icon: 'Watch', isActive: true },
      { name: 'Clothing', description: 'Jackets, hoodies, caps, umbrellas', icon: 'Shirt', isActive: true },
      { name: 'Documents', description: 'Passports, fee receipts, certificates', icon: 'FileText', isActive: true },
      { name: 'Other Items', description: 'Miscellaneous items', icon: 'Box', isActive: true },
    ]);
    console.log(`Created ${categories.length} campus categories.`);

    // 3. Seed Lost Items
    const lost1 = await LostItem.create({
      reportedBy: student._id,
      itemName: 'Apple MacBook Pro M2 (Space Gray)',
      category: 'Electronics',
      description: 'Left in Science Building Room 302 after 4 PM lecture. Has a blue developer sticker on top lid.',
      color: 'Space Gray',
      brand: 'Apple',
      dateLost: new Date('2026-10-05'),
      approximateTime: '16:15',
      locationLost: 'Science Building - Room 302',
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'],
    });

    const lost2 = await LostItem.create({
      reportedBy: student._id,
      itemName: 'Leather Wallet with College ID',
      category: 'ID Cards',
      description: 'Brown bi-fold wallet containing student ID 24CS088 and metro card.',
      color: 'Brown',
      brand: 'WildHorn',
      dateLost: new Date('2026-10-08'),
      locationLost: 'Central Cafeteria Ground Floor',
      status: 'pending_review',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600'],
    });

    // 4. Seed Found Items in Custody
    const found1 = await FoundItem.create({
      registeredBy: staff._id,
      internalItemName: 'Space Gray MacBook Pro with Sticker',
      category: 'Electronics',
      internalDescription: '13-inch Space Gray MacBook Pro with sticker on lid. Turned in from Science Building.',
      color: 'Space Gray',
      brand: 'Apple',
      dateFound: new Date('2026-10-06'),
      generalLocation: 'Science Building 3rd Floor',
      storageLocation: 'Central Security Locker B-04',
      status: 'in_custody',
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'],
    });

    const found2 = await FoundItem.create({
      registeredBy: staff._id,
      internalItemName: 'TI-84 Plus Graphing Calculator',
      category: 'Electronics',
      internalDescription: 'Black TI-84 Plus CE graphing calculator left on lecture podium.',
      color: 'Black',
      brand: 'Texas Instruments',
      dateFound: new Date('2026-10-07'),
      generalLocation: 'Engineering Hall Auditorium B',
      storageLocation: 'Faculty Office Cupboard 2',
      status: 'in_custody',
      images: ['https://images.unsplash.com/photo-1516201580490-33550d32de5c?auto=format&fit=crop&q=80&w=600'],
    });

    const found3 = await FoundItem.create({
      registeredBy: staff._id,
      internalItemName: 'Sony Wireless Headphones WH-1000XM4',
      category: 'Electronics',
      internalDescription: 'Black Sony over-ear noise canceling headphones in carry case.',
      color: 'Black',
      brand: 'Sony',
      dateFound: new Date('2026-09-28'),
      generalLocation: 'Central Library 2nd Floor Study Room',
      storageLocation: 'Security Safe Room Cabinet A',
      status: 'returned',
      handedOverTo: student._id,
      handoverConfirmedBy: staff._id,
      handoverConfirmedAt: new Date('2026-10-02'),
      handoverNotes: 'Student verified serial number and device bluetooth pairing. Physical handover confirmed.',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'],
    });

    console.log('Created sample Lost and Found item records.');

    // 5. Seed Claims
    const claim1 = await Claim.create({
      foundItem: found1._id,
      lostItem: lost1._id,
      claimant: student._id,
      explanation: 'I left my MacBook Pro in room 302 after our distributed systems lecture.',
      identifyingEvidence: 'Has a blue octocat developer sticker on top lid, username is neev_patel, desktop wallpaper is Yosemite.',
      proofFiles: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'],
      status: 'under_review',
      reviewedBy: staff._id,
      reviewRemark: 'Serial number and sticker match. Please visit Security Desk with student ID.',
      reviewedAt: new Date('2026-10-09'),
    });

    console.log('Created sample Claim under review.');

    // 6. Seed Audit Log
    await AuditLog.create([
      {
        actor: admin._id,
        action: 'SYSTEM_INITIALIZATION',
        targetType: 'System',
        targetId: 'SYS-INIT',
        summary: 'Admin initialized CampusFind college environment and configured campus categories.',
      },
      {
        actor: staff._id,
        action: 'CREATE_FOUND_ITEM',
        targetType: 'FoundItem',
        targetId: found1._id.toString(),
        summary: `Staff '${staff.name}' logged found item '${found1.internalItemName}' into custody at '${found1.storageLocation}'.`,
      },
      {
        actor: staff._id,
        action: 'CONFIRM_HANDOVER',
        targetType: 'FoundItem',
        targetId: found3._id.toString(),
        summary: `Staff '${staff.name}' completed verified handover of '${found3.internalItemName}' to student '${student.name}'.`,
      },
    ]);

    // 7. Seed Notifications
    await Notification.create([
      {
        recipient: student._id,
        title: 'Potential Match Found',
        message: 'A found item matching your "Apple MacBook Pro M2" has been registered into campus custody.',
        type: 'match',
        relatedItem: found1._id,
      },
      {
        recipient: student._id,
        title: 'Claim Update: Under Review',
        message: 'Your claim for the MacBook Pro is currently under review by campus staff.',
        type: 'claim',
        relatedClaim: claim1._id,
      },
    ]);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
