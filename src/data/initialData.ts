import { Student, TokenRecord, AttendanceRecord, CodexTransaction, CodexPerk } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu_1',
    tokenId: 'OXF-2026-A891',
    fullName: 'Aarav Sharma',
    grade: 'Grade 10',
    section: 'Section A',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9847012345',
    isOnboarded: true,
    codexBalance: 150,
    registeredAt: '2026-08-01',
    track: 'Full-Stack Web Development'
  },
  {
    id: 'stu_2',
    tokenId: 'OXF-2026-B104',
    fullName: 'Diya Poudel',
    grade: 'Grade 10',
    section: 'Section B',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9857054321',
    isOnboarded: true,
    codexBalance: 180,
    registeredAt: '2026-08-01',
    track: 'Algorithms & Data Structures'
  },
  {
    id: 'stu_3',
    tokenId: 'OXF-2026-C230',
    fullName: 'Rohan Thapa',
    grade: 'Grade 9',
    section: 'Section A',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9812345678',
    isOnboarded: true,
    codexBalance: 120,
    registeredAt: '2026-08-02',
    track: 'Python & Game Dev'
  },
  {
    id: 'stu_4',
    tokenId: 'OXF-2026-D442',
    fullName: 'Prashant Adhikari',
    grade: 'Grade 11',
    section: 'Section Science',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9867112233',
    isOnboarded: true,
    codexBalance: 210,
    registeredAt: '2026-08-01',
    track: 'Full-Stack Web Development'
  },
  {
    id: 'stu_5',
    tokenId: 'OXF-2026-E550',
    fullName: 'Sneha Shrestha',
    grade: 'Grade 9',
    section: 'Section B',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9803456789',
    isOnboarded: true,
    codexBalance: 90,
    registeredAt: '2026-08-03',
    track: 'Python & Game Dev'
  },
  {
    id: 'stu_6',
    tokenId: 'OXF-2026-F612',
    fullName: 'Bikash KC',
    grade: 'Grade 10',
    section: 'Section A',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9847556677',
    isOnboarded: true,
    codexBalance: 140,
    registeredAt: '2026-08-02',
    track: 'Systems & Web Security'
  },
  {
    id: 'stu_7',
    tokenId: 'OXF-2026-G789',
    fullName: 'Kritika Bhattarai',
    grade: 'Grade 11',
    section: 'Section Science',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9857998877',
    isOnboarded: true,
    codexBalance: 195,
    registeredAt: '2026-08-01',
    track: 'Algorithms & Data Structures'
  },
  {
    id: 'stu_8',
    tokenId: 'OXF-2026-H890',
    fullName: 'Ayush Regmi',
    grade: 'Grade 12',
    section: 'Section A',
    schoolName: 'Oxford Secondary School',
    parentPhone: '+977 9811223344',
    isOnboarded: true,
    codexBalance: 240,
    registeredAt: '2026-08-01',
    track: 'Full-Stack Web Development'
  }
];

export const INITIAL_TOKENS: TokenRecord[] = [
  { token: 'OXF-2026-A891', studentId: 'stu_1', studentName: 'Aarav Sharma', isOnboarded: true, createdAt: '2026-08-01' },
  { token: 'OXF-2026-B104', studentId: 'stu_2', studentName: 'Diya Poudel', isOnboarded: true, createdAt: '2026-08-01' },
  { token: 'OXF-2026-C230', studentId: 'stu_3', studentName: 'Rohan Thapa', isOnboarded: true, createdAt: '2026-08-02' },
  { token: 'OXF-2026-D442', studentId: 'stu_4', studentName: 'Prashant Adhikari', isOnboarded: true, createdAt: '2026-08-01' },
  { token: 'OXF-2026-E550', studentId: 'stu_5', studentName: 'Sneha Shrestha', isOnboarded: true, createdAt: '2026-08-03' },
  { token: 'OXF-2026-F612', studentId: 'stu_6', studentName: 'Bikash KC', isOnboarded: true, createdAt: '2026-08-02' },
  { token: 'OXF-2026-G789', studentId: 'stu_7', studentName: 'Kritika Bhattarai', isOnboarded: true, createdAt: '2026-08-01' },
  { token: 'OXF-2026-H890', studentId: 'stu_8', studentName: 'Ayush Regmi', isOnboarded: true, createdAt: '2026-08-01' },
  // Un-onboarded tokens for instant onboarding testing:
  { token: 'OXF-2026-NEW99', isOnboarded: false, createdAt: '2026-08-16', assignedGrade: 'Grade 10' },
  { token: 'OXF-2026-GUEST', isOnboarded: false, createdAt: '2026-08-16', assignedGrade: 'Grade 9' },
  { token: 'OXF-2026-SUMMER', isOnboarded: false, createdAt: '2026-08-16', assignedGrade: 'Grade 11' }
];

export const TODAY_STR = '2026-08-17';

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Today's records (pre-filled with some present, some absent)
  { id: 'att_1_today', studentId: 'stu_1', date: TODAY_STR, status: 'PRESENT', checkInTime: '09:12 AM', verifiedBy: 'SELF', timestamp: 1786957920000 },
  { id: 'att_2_today', studentId: 'stu_2', date: TODAY_STR, status: 'PRESENT', checkInTime: '08:58 AM', verifiedBy: 'SELF', timestamp: 1786957080000 },
  { id: 'att_3_today', studentId: 'stu_3', date: TODAY_STR, status: 'ABSENT', checkInTime: null, verifiedBy: 'ADMIN', timestamp: 1786957000000 },
  { id: 'att_4_today', studentId: 'stu_4', date: TODAY_STR, status: 'PRESENT', checkInTime: '09:05 AM', verifiedBy: 'SELF', timestamp: 1786957500000 },
  { id: 'att_5_today', studentId: 'stu_5', date: TODAY_STR, status: 'ABSENT', checkInTime: null, verifiedBy: 'ADMIN', timestamp: 1786957000000 },
  { id: 'att_6_today', studentId: 'stu_6', date: TODAY_STR, status: 'PRESENT', checkInTime: '09:20 AM', verifiedBy: 'SELF', timestamp: 1786958400000 },
  { id: 'att_7_today', studentId: 'stu_7', date: TODAY_STR, status: 'PRESENT', checkInTime: '09:02 AM', verifiedBy: 'SELF', timestamp: 1786957320000 },
  { id: 'att_8_today', studentId: 'stu_8', date: TODAY_STR, status: 'PRESENT', checkInTime: '08:50 AM', verifiedBy: 'SELF', timestamp: 1786956600000 },

  // Previous days history (Aug 11 to Aug 16)
  { id: 'att_1_aug16', studentId: 'stu_1', date: '2026-08-16', status: 'PRESENT', checkInTime: '09:14 AM', verifiedBy: 'SELF', timestamp: 1786871640000 },
  { id: 'att_1_aug15', studentId: 'stu_1', date: '2026-08-15', status: 'PRESENT', checkInTime: '09:08 AM', verifiedBy: 'SELF', timestamp: 1786784880000 },
  { id: 'att_1_aug14', studentId: 'stu_1', date: '2026-08-14', status: 'PRESENT', checkInTime: '09:22 AM', verifiedBy: 'SELF', timestamp: 1786699320000 },
  { id: 'att_1_aug13', studentId: 'stu_1', date: '2026-08-13', status: 'ABSENT', checkInTime: null, verifiedBy: 'ADMIN', timestamp: 1786612800000 },
  { id: 'att_1_aug12', studentId: 'stu_1', date: '2026-08-12', status: 'PRESENT', checkInTime: '09:05 AM', verifiedBy: 'SELF', timestamp: 1786525500000 },
  { id: 'att_1_aug11', studentId: 'stu_1', date: '2026-08-11', status: 'PRESENT', checkInTime: '08:59 AM', verifiedBy: 'SELF', timestamp: 1786438740000 },

  // Diya's history
  { id: 'att_2_aug16', studentId: 'stu_2', date: '2026-08-16', status: 'PRESENT', checkInTime: '09:01 AM', verifiedBy: 'SELF', timestamp: 1786870860000 },
  { id: 'att_2_aug15', studentId: 'stu_2', date: '2026-08-15', status: 'PRESENT', checkInTime: '09:00 AM', verifiedBy: 'SELF', timestamp: 1786784400000 },
  { id: 'att_2_aug14', studentId: 'stu_2', date: '2026-08-14', status: 'PRESENT', checkInTime: '09:10 AM', verifiedBy: 'SELF', timestamp: 1786698600000 },
  { id: 'att_2_aug13', studentId: 'stu_2', date: '2026-08-13', status: 'PRESENT', checkInTime: '08:55 AM', verifiedBy: 'SELF', timestamp: 1786611300000 },

  // Rohan's history
  { id: 'att_3_aug16', studentId: 'stu_3', date: '2026-08-16', status: 'PRESENT', checkInTime: '09:18 AM', verifiedBy: 'SELF', timestamp: 1786871880000 },
  { id: 'att_3_aug15', studentId: 'stu_3', date: '2026-08-15', status: 'ABSENT', checkInTime: null, verifiedBy: 'ADMIN', timestamp: 1786784400000 }
];

export const INITIAL_TRANSACTIONS: CodexTransaction[] = [
  { id: 'tx_1', studentId: 'stu_1', amount: 50, type: 'EARNED', reason: 'Summer Camp Welcome Grant', date: '2026-08-01' },
  { id: 'tx_2', studentId: 'stu_1', amount: 10, type: 'EARNED', reason: 'Daily Check-in Reward (Aug 11)', date: '2026-08-11' },
  { id: 'tx_3', studentId: 'stu_1', amount: 10, type: 'EARNED', reason: 'Daily Check-in Reward (Aug 12)', date: '2026-08-12' },
  { id: 'tx_4', studentId: 'stu_1', amount: 30, type: 'EARNED', reason: 'Git Branching & PRs Lab Completion', date: '2026-08-14' },
  { id: 'tx_5', studentId: 'stu_1', amount: 40, type: 'EARNED', reason: 'Speed Debugging Contest 2nd Place', date: '2026-08-15' },
  { id: 'tx_6', studentId: 'stu_1', amount: 10, type: 'EARNED', reason: 'Daily Check-in Reward (Aug 16)', date: '2026-08-16' }
];

export const CODEX_PERKS: CodexPerk[] = [
  {
    id: 'perk_1',
    title: 'Oxford Dev Sticker Pack & Lanyard',
    cost: 80,
    description: 'Matte holographic developer stickers and Oxford Summer Camp woven lanyard.',
    category: 'SWAG',
    unlocked: true
  },
  {
    id: 'perk_2',
    title: 'Camp Distinction Certificate with Badge',
    cost: 150,
    description: 'Official verified certificate with high distinction and verified cryptographic token serial.',
    category: 'CERTIFICATION',
    unlocked: true
  },
  {
    id: 'perk_3',
    title: '1-on-1 Mentor Architecture Review',
    cost: 200,
    description: '30-minute deep-dive review of your final capstone project with senior software engineers.',
    category: 'MENTORSHIP',
    unlocked: false
  },
  {
    id: 'perk_4',
    title: 'Raspberry Pi Pico Microcontroller Kit',
    cost: 350,
    description: 'Hardware starter kit for embedded programming and IoT experiments.',
    category: 'HARDWARE',
    unlocked: false
  }
];
