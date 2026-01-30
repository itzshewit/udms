/*
  University Dormitory Management System (UDMS)
  Purpose: Global type definitions for the platform.
*/

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF',
  SECURITY = 'SECURITY'
}

export enum Permission {
  MANAGE_ROOMS = 'MANAGE_ROOMS',
  REASSIGN_ROOM = 'REASSIGN_ROOM',
  OVERRIDE_FEE = 'OVERRIDE_FEE',
  MANAGE_USERS = 'MANAGE_USERS',
  SECURITY_LOCKDOWN = 'SECURITY_LOCKDOWN',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  VIEW_FINANCIALS = 'VIEW_FINANCIALS',
  SUBMIT_MAINTENANCE = 'SUBMIT_MAINTENANCE',
  APPROVE_MAINTENANCE = 'APPROVE_MAINTENANCE',
  GATE_ACCESS = 'GATE_ACCESS'
}

export interface StudentPreferences {
  sleepHabit: 'Early Bird' | 'Night Owl';
  studyEnvironment: 'Quiet' | 'Social';
  cleanliness: 'Neat' | 'Relaxed';
  hobbies: string[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  permissions: Permission[]; // Granular RBAC
  studentId?: string;
  assignedRoomId?: string;
  checkInStatus?: 'Not Checked In' | 'Pending Approval' | 'Checked In' | 'Checked Out';
  points: number;
  level: number;
  wellnessScore: number;
  preferences?: StudentPreferences;
  badges: Badge[];
  healthMetrics: {
    sleepHours: number;
    studyHours: number;
    activityLevel: number;
  };
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  dormitory: string;
  capacity: number;
  occupied: number;
  status: 'Available' | 'Full' | 'Maintenance';
  lastCleaned: string;
  avgCompatibility?: number;
}

export interface MaintenanceRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'Plumbing' | 'Electrical' | 'Cleaning' | 'Furniture' | 'Other';
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  isPreventative?: boolean;
  rating?: number;
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  change: 'up' | 'down' | 'stable';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isNudge?: boolean;
}

export interface Visitor {
  id: string;
  name: string;
  residentId: string;
  residentName: string;
  expectedArrival: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'Upcoming' | 'Checked In' | 'Checked Out' | 'Denied';
  visitType: 'Friend' | 'Family' | 'Maintenance' | 'Other';
}

export interface SystemNotification {
  id: string;
  type: 'SMS' | 'EMAIL' | 'PUSH';
  title: string;
  content: string;
  timestamp: string;
  recipientId: string;
  actionUrl?: string;
  tabTarget?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  description: string;
  transactionHash?: string;
}

export interface DormEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  xpReward: number;
  icon: string;
  attendees: string[];
}