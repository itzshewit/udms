/*
  University Dormitory Management System (UDMS)
  Purpose: Mock data constants for development and simulation.
*/

import { UserRole, User, Room, MaintenanceRequest, Payment, Visitor, DormEvent, Permission } from './types';

export const MOCK_USERS: User[] = [
  // Super Admin
  { 
    id: 'super-admin', name: 'University Head', email: 'superadmin@university.edu', password: 'SuperSecure123!', role: UserRole.ADMIN, 
    permissions: [
      Permission.MANAGE_ROOMS, Permission.REASSIGN_ROOM, Permission.OVERRIDE_FEE, 
      Permission.MANAGE_USERS, Permission.SECURITY_LOCKDOWN, Permission.VIEW_AUDIT_LOGS, Permission.VIEW_FINANCIALS
    ],
    points: 0, level: 10, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 8, studyHours: 0, activityLevel: 50 } 
  },
  // Dorm Managers
  { 
    id: 'admin-north', name: 'Dorm Admin – North Hall', email: 'dormadmin1@university.edu', password: 'DormAdmin123!', role: UserRole.ADMIN, 
    permissions: [
      Permission.MANAGE_ROOMS, Permission.VIEW_FINANCIALS, Permission.APPROVE_MAINTENANCE
    ], // Restricted: REASSIGN_ROOM, OVERRIDE_FEE, SECURITY_LOCKDOWN, MANAGE_USERS
    points: 0, level: 5, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 7, studyHours: 0, activityLevel: 40 } 
  },
  { 
    id: 'admin-south', name: 'Dorm Admin – South Hall', email: 'dormadmin2@university.edu', password: 'DormAdmin123!', role: UserRole.ADMIN, 
    permissions: [
      Permission.MANAGE_ROOMS, Permission.VIEW_FINANCIALS, Permission.APPROVE_MAINTENANCE
    ], // Restricted: REASSIGN_ROOM, OVERRIDE_FEE, SECURITY_LOCKDOWN, MANAGE_USERS
    points: 0, level: 5, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 7, studyHours: 0, activityLevel: 40 } 
  },
  // Maintenance Staff
  { 
    id: 'staff-north', name: 'Electrician – North Hall', email: 'maint1@university.edu', password: 'Maintenance123!', role: UserRole.STAFF, 
    permissions: [Permission.APPROVE_MAINTENANCE],
    points: 0, level: 3, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 8, studyHours: 0, activityLevel: 90 } 
  },
  { 
    id: 'staff-south', name: 'Plumber – South Hall', email: 'maint2@university.edu', password: 'Maintenance123!', role: UserRole.STAFF, 
    permissions: [Permission.APPROVE_MAINTENANCE],
    points: 0, level: 3, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 8, studyHours: 0, activityLevel: 90 } 
  },
  // Security Staff
  { 
    id: 'sec-north', name: 'Gate Staff – North Entry', email: 'security1@university.edu', password: 'GateAccess123!', role: UserRole.SECURITY, 
    permissions: [Permission.GATE_ACCESS],
    points: 0, level: 2, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 7, studyHours: 0, activityLevel: 60 } 
  },
  { 
    id: 'sec-south', name: 'Gate Staff – South Entry', email: 'security2@university.edu', password: 'GateAccess123!', role: UserRole.SECURITY, 
    permissions: [Permission.GATE_ACCESS],
    points: 0, level: 2, wellnessScore: 100, badges: [], healthMetrics: { sleepHours: 7, studyHours: 0, activityLevel: 60 } 
  },
  // Students
  { 
    id: 's1001', name: 'John Doe', email: 's1001@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1001', assignedRoomId: 'R101', checkInStatus: 'Checked In', points: 1450, level: 5, wellnessScore: 88,
    preferences: { sleepHabit: 'Night Owl', studyEnvironment: 'Quiet', cleanliness: 'Neat', hobbies: ['Coding', 'Chess'] },
    badges: [{ id: 'b1', name: 'Punctual Payer', icon: '💰', description: 'Always pays fees on time' }],
    healthMetrics: { sleepHours: 7.5, studyHours: 5, activityLevel: 80 }
  },
  { 
    id: 's1002', name: 'Jane Smith', email: 's1002@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1002', assignedRoomId: 'R102', checkInStatus: 'Checked In', points: 820, level: 3, wellnessScore: 72,
    preferences: { sleepHabit: 'Early Bird', studyEnvironment: 'Social', cleanliness: 'Relaxed', hobbies: ['Reading', 'Gaming'] },
    badges: [{ id: 'b3', name: 'Clean Room', icon: '✨', description: 'Passes all inspections' }],
    healthMetrics: { sleepHours: 6, studyHours: 8, activityLevel: 45 }
  },
  { 
    id: 's1003', name: 'Alex Johnson', email: 's1003@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1003', assignedRoomId: 'R201', checkInStatus: 'Pending Approval', points: 500, level: 2, wellnessScore: 65,
    preferences: { sleepHabit: 'Night Owl', studyEnvironment: 'Social', cleanliness: 'Relaxed', hobbies: ['Music', 'Fitness'] },
    badges: [],
    healthMetrics: { sleepHours: 5, studyHours: 6, activityLevel: 95 }
  },
  { 
    id: 's1004', name: 'Maria Lee', email: 's1004@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1004', assignedRoomId: 'R202', checkInStatus: 'Not Checked In', points: 1200, level: 4, wellnessScore: 90,
    preferences: { sleepHabit: 'Early Bird', studyEnvironment: 'Quiet', cleanliness: 'Neat', hobbies: ['Art', 'Swimming'] },
    badges: [],
    healthMetrics: { sleepHours: 8, studyHours: 4, activityLevel: 70 }
  },
  { 
    id: 's1005', name: 'Samuel T.', email: 's1005@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1005', assignedRoomId: 'R103', checkInStatus: 'Checked In', points: 300, level: 1, wellnessScore: 82,
    preferences: { sleepHabit: 'Early Bird', studyEnvironment: 'Quiet', cleanliness: 'Neat', hobbies: ['Photography'] },
    badges: [],
    healthMetrics: { sleepHours: 7, studyHours: 5, activityLevel: 30 }
  },
  { 
    id: 's1006', name: 'Fatima K.', email: 's1006@university.edu', password: 'StudentTemp123!', role: UserRole.STUDENT, 
    permissions: [Permission.SUBMIT_MAINTENANCE],
    studentId: 'S1006', assignedRoomId: 'R203', checkInStatus: 'Checked In', points: 600, level: 2, wellnessScore: 95,
    preferences: { sleepHabit: 'Night Owl', studyEnvironment: 'Quiet', cleanliness: 'Neat', hobbies: ['Cooking'] },
    badges: [],
    healthMetrics: { sleepHours: 7, studyHours: 9, activityLevel: 50 }
  }
];

export const MOCK_ROOMS: Room[] = [
  // North Hall
  { id: 'R101', number: '101', floor: 1, dormitory: 'North Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-24', avgCompatibility: 85 },
  { id: 'R102', number: '102', floor: 1, dormitory: 'North Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-23', avgCompatibility: 70 },
  { id: 'R103', number: '103', floor: 1, dormitory: 'North Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-25', avgCompatibility: 92 },
  // South Hall
  { id: 'R201', number: '201', floor: 2, dormitory: 'South Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-22', avgCompatibility: 100 },
  { id: 'R202', number: '202', floor: 2, dormitory: 'South Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-15', avgCompatibility: 0 },
  { id: 'R203', number: '203', floor: 2, dormitory: 'South Hall', capacity: 2, occupied: 1, status: 'Available', lastCleaned: '2024-01-26', avgCompatibility: 88 },
];

export const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'M1',
    studentId: 's1001',
    studentName: 'John Doe',
    roomNumber: '101',
    category: 'Plumbing',
    description: 'Leaking faucet in the bathroom.',
    status: 'Pending',
    priority: 'Medium',
    createdAt: new Date().toISOString()
  },
  {
    id: 'M2',
    studentId: 's1003',
    studentName: 'Alex Johnson',
    roomNumber: '201',
    category: 'Electrical',
    description: 'Sparking outlet near the bed.',
    status: 'In Progress',
    priority: 'High',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'P1', studentId: 's1001', amount: 1500, status: 'Paid', dueDate: '2024-02-01', description: 'Semester 2 Rent', transactionHash: '0xabc123...' },
  { id: 'P2', studentId: 's1001', amount: 200, status: 'Pending', dueDate: '2024-03-01', description: 'Utility Overdue' },
  { id: 'P3', studentId: 's1002', amount: 1500, status: 'Pending', dueDate: '2024-02-01', description: 'Semester 2 Rent' },
  { id: 'P4', studentId: 's1004', amount: 1500, status: 'Overdue', dueDate: '2024-01-01', description: 'Semester 1 Rent' }
];

export const MOCK_VISITORS: Visitor[] = [
  { id: 'V1', name: 'Robert Smith', residentId: 's1001', residentName: 'John Doe', expectedArrival: '2024-02-15T14:00:00Z', status: 'Upcoming', visitType: 'Friend' },
  { id: 'V2', name: 'Mary Watson', residentId: 's1002', residentName: 'Jane Smith', expectedArrival: '2024-02-14T10:00:00Z', status: 'Checked In', visitType: 'Family' }
];

export const MOCK_EVENTS: DormEvent[] = [
  { id: 'E1', title: 'Floor 1 Gaming Night', description: 'Tournament-style Mario Kart night in the lounge.', location: 'North Hall Lounge', time: 'Tonight 8 PM', xpReward: 50, icon: '🎮', attendees: ['s1001', 's1002'] },
  { id: 'E2', title: 'Study Hub Orientation', description: 'Learn how to maximize your study time with our resources.', location: 'South Hall Library', time: 'Mon 2 PM', xpReward: 20, icon: '📚', attendees: [] },
  { id: 'E3', title: 'Dorm BBQ Social', description: 'Free food and networking with other residents.', location: 'Outdoor Courtyard', time: 'Sat 12 PM', xpReward: 100, icon: '🍔', attendees: ['s1001'] },
];