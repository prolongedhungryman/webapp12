export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface Student {
  id: string;
  tokenId: string;
  fullName: string;
  grade: string;
  section: string;
  schoolName: string;
  parentPhone: string;
  isOnboarded: boolean;
  codexBalance: number;
  registeredAt: string;
  avatarSeed?: string;
  track?: string;
  password?: string;
}

export interface TokenRecord {
  token: string;
  studentId?: string;
  studentName?: string;
  isOnboarded: boolean;
  createdAt: string;
  assignedGrade?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime: string | null; // e.g., '09:15 AM'
  verifiedBy: 'SELF' | 'ADMIN';
  timestamp: number;
}

export interface CodexTransaction {
  id: string;
  studentId: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED';
  reason: string;
  date: string;
}

export interface CodexPerk {
  id: string;
  title: string;
  cost: number;
  description: string;
  category: 'SWAG' | 'HARDWARE' | 'CERTIFICATION' | 'MENTORSHIP';
  unlocked: boolean;
}

export interface CampStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
}
