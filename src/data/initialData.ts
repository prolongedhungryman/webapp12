import { Student, TokenRecord, AttendanceRecord, CodexTransaction, CodexPerk } from '../types';

// No hardcoded dummy students — all student data comes from Supabase backend
export const INITIAL_STUDENTS: Student[] = [];

// No hardcoded tokens — all tokens come from Supabase backend
export const INITIAL_TOKENS: TokenRecord[] = [];

// Dynamic today string based on actual current date
export const TODAY_STR = new Date().toISOString().split('T')[0];

// No hardcoded attendance — all records come from Supabase backend
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

// No hardcoded transactions — all records come from Supabase backend
export const INITIAL_TRANSACTIONS: CodexTransaction[] = [];

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
