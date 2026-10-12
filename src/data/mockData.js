import { INITIAL_USERS } from './mockUsers';
import { INITIAL_LOST_ITEMS } from './mockLostItems';
import { INITIAL_FOUND_ITEMS } from './mockFoundItems';
import { INITIAL_CLAIMS } from './mockClaims';
import { INITIAL_NOTIFICATIONS } from './mockNotifications';
import { INITIAL_AI_MATCHES } from './mockAIMatches';

export {
  INITIAL_USERS,
  INITIAL_LOST_ITEMS,
  INITIAL_FOUND_ITEMS,
  INITIAL_CLAIMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AI_MATCHES
};

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: 'Laptop', count: 42, color: 'bg-blue-50 text-blue-600' },
  { id: 'id-cards', name: 'ID Cards', icon: 'CreditCard', count: 68, color: 'bg-purple-50 text-purple-600' },
  { id: 'books', name: 'Books & Notes', icon: 'BookOpen', count: 31, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'bags', name: 'Bags & Backpacks', icon: 'ShoppingBag', count: 24, color: 'bg-amber-50 text-amber-600' },
  { id: 'keys', name: 'Keys & Fobs', icon: 'Key', count: 19, color: 'bg-rose-50 text-rose-600' },
  { id: 'accessories', name: 'Accessories', icon: 'Watch', count: 27, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'clothing', name: 'Clothing', icon: 'Shirt', count: 15, color: 'bg-cyan-50 text-cyan-600' },
  { id: 'documents', name: 'Documents', icon: 'FileText', count: 12, color: 'bg-orange-50 text-orange-600' },
  { id: 'other', name: 'Other Items', icon: 'Box', count: 18, color: 'bg-slate-50 text-slate-600' }
];

export const LOCATIONS = [
  'Central Library',
  'Main Campus Canteen',
  'Computer Lab 3 (CS Dept)',
  'Main Gate Entrance',
  'Student Parking Area',
  'Block B - Lecture Hall 102',
  'Auditorium Complex',
  'Sports Complex & Gymnasium',
  'Chemistry Laboratory',
  'Hostel Block A Lounge',
  'Student Center Cafeteria',
  'Classroom Block C (Room 204)',
  'Main Building - Atrium'
];
