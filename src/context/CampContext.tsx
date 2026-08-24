import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Student, TokenRecord, AttendanceRecord, CodexTransaction, CampStats, AttendanceStatus } from '../types';
import { INITIAL_STUDENTS, INITIAL_TOKENS, INITIAL_ATTENDANCE, INITIAL_TRANSACTIONS } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { checkRateLimit } from '../lib/rateLimit';
import { DEFAULT_CAMP_CLASS, addDays } from '../lib/campOptions';
import * as XLSX from 'xlsx';

interface CampContextType {
  students: Student[];
  tokens: TokenRecord[];
  attendanceRecords: AttendanceRecord[];
  transactions: CodexTransaction[];
  currentStudent: Student | null;
  isAdminLoggedIn: boolean;
  pendingOnboardingToken: string | null;
  authModalOpen: boolean;
  authModalTab: 'student' | 'admin';
  stats: CampStats;
  todayStr: string;
  isBackendConnected: boolean;
  isLoading: boolean;
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'student' | 'admin') => void;
  openStudentAuth: () => void;
  openAdminAuth: () => void;
  loginWithToken: (tokenInput: string) => Promise<{ success: boolean; needsOnboarding?: boolean; message?: string }>;
  signupStudent: (data: {
    tokenCode: string;
    password: string;
    fullName: string;
    grade: string;
    section: string;
  }) => Promise<{ success: boolean; message?: string }>;
  loginStudentWithPassword: (
    tokenCode: string,
    passwordInput: string
  ) => Promise<{ success: boolean; message?: string }>;
  loginAdmin: (user: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  completeOnboarding: (data: {
    fullName: string;
    grade: string;
    section: string;
    schoolName: string;
    parentPhone: string;
    track?: string;
  }) => Promise<void> | void;
  cancelOnboarding: () => void;
  updateStudentProfile: (studentId: string, updates: Partial<Student>) => Promise<void> | void;
  markAttendanceSelf: (studentId: string) => Promise<void> | void;
  adminToggleAttendance: (studentId: string, date: string, newStatus: AttendanceStatus) => Promise<void> | void;
  adminGenerateToken: (assignedGrade?: string, studentName?: string) => Promise<string> | string;
  adminRevokeToken: (tokenStr: string) => Promise<void> | void;
  exportAttendanceCSV: () => void;
  addOrUpdateStudent: (input: {
    fullName: string;
    token?: string;
    studentClass: string;
    section: string;
    assignedGrade: string;
    points: number;
  }) => Promise<Student>;
  markAttendance: (studentToken: string, date: string, present: boolean) => Promise<void>;
  adjustCodexPoints: (studentToken: string, delta: number) => Promise<void>;
  exportAttendance: (endDate?: string) => Promise<void>;
  resetDemoData: () => Promise<void> | void;
  refreshFromBackend: () => Promise<void>;
}

const CampContext = createContext<CampContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_STUDENT_ID: 'oxf_camp_cur_student_id_v1',
  IS_ADMIN: 'oxf_camp_is_admin_v1',
  PENDING_TOKEN: 'oxf_camp_pending_token_v1',
};

// Dynamic today string — always uses actual current date
const getTodayStr = () => new Date().toISOString().split('T')[0];

// Database mappers
const mapDbStudentToStudent = (row: any): Student => ({
  id: row.id,
  tokenId: row.token_id,
  fullName: row.full_name,
  grade: row.grade,
  section: row.section,
  schoolName: row.school_name || 'Oxford Secondary School',
  parentPhone: row.parent_phone,
  isOnboarded: Boolean(row.is_onboarded),
  codexBalance: Number(row.codex_balance) || 0,
  registeredAt: row.registered_at,
  avatarSeed: row.avatar_seed || undefined,
  track: row.track || 'Full-Stack Web Development',
  password: row.password || undefined,
});

const mapDbTokenToToken = (row: any): TokenRecord => ({
  token: row.token,
  studentId: row.student_id || undefined,
  studentName: row.student_name || undefined,
  isOnboarded: Boolean(row.is_onboarded),
  createdAt: row.created_at,
  assignedGrade: row.assigned_grade || undefined,
});

const mapDbAttendanceToAttendance = (row: any): AttendanceRecord => ({
  id: row.id,
  studentId: row.student_id,
  date: row.date,
  status: row.status as AttendanceStatus,
  checkInTime: row.check_in_time || null,
  verifiedBy: (row.verified_by || 'SELF') as 'SELF' | 'ADMIN',
  timestamp: Number(row.timestamp) || Date.now(),
});

const mapDbTxToTx = (row: any): CodexTransaction => ({
  id: row.id,
  studentId: row.student_id,
  amount: Number(row.amount) || 0,
  type: row.type as 'EARNED' | 'REDEEMED',
  reason: row.reason,
  date: row.date,
});

export const CampProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Backend-first: start with empty arrays, populate from Supabase
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [tokens, setTokens] = useState<TokenRecord[]>(INITIAL_TOKENS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [transactions, setTransactions] = useState<CodexTransaction[]>(INITIAL_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const todayStr = getTodayStr();

  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID) || null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [pendingOnboardingToken, setPendingOnboardingToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.PENDING_TOKEN) || null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'student' | 'admin'>('student');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Persist only session state to localStorage (NOT student/token data)
  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, currentStudentId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    }
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ADMIN, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (pendingOnboardingToken) {
      localStorage.setItem(STORAGE_KEYS.PENDING_TOKEN, pendingOnboardingToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PENDING_TOKEN);
    }
  }, [pendingOnboardingToken]);

  // Fetch all state from Supabase backend (single source of truth)
  const refreshFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const [stuRes, tokRes, attRes, txRes] = await Promise.all([
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('tokens').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance_records').select('*').order('date', { ascending: false }),
        supabase.from('codex_transactions').select('*').order('created_at', { ascending: false }),
      ]);

      // Always set from backend — even if empty (empty is valid, not an error)
      if (stuRes.data) {
        setStudents(stuRes.data.map(mapDbStudentToStudent));
      }
      if (tokRes.data) {
        setTokens(tokRes.data.map(mapDbTokenToToken));
      }
      if (attRes.data) {
        setAttendanceRecords(attRes.data.map(mapDbAttendanceToAttendance));
      }
      if (txRes.data) {
        setTransactions(txRes.data.map(mapDbTxToTx));
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend sync failed:', err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load from Supabase and subscribe to Realtime updates
  useEffect(() => {
    refreshFromBackend();

    // Supabase Realtime channel for live multi-client synchronization
    const channel = supabase
      .channel('camp_live_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newStu = mapDbStudentToStudent(payload.new);
            setStudents((prev) => [newStu, ...prev.filter((s) => s.id !== newStu.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedStu = mapDbStudentToStudent(payload.new);
            setStudents((prev) => prev.map((s) => (s.id === updatedStu.id ? updatedStu : s)));
          } else if (payload.eventType === 'DELETE') {
            setStudents((prev) => prev.filter((s) => s.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tokens' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTok = mapDbTokenToToken(payload.new);
            setTokens((prev) => [newTok, ...prev.filter((t) => t.token !== newTok.token)]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTok = mapDbTokenToToken(payload.new);
            setTokens((prev) => prev.map((t) => (t.token === updatedTok.token ? updatedTok : t)));
          } else if (payload.eventType === 'DELETE') {
            setTokens((prev) => prev.filter((t) => t.token !== payload.old.token));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance_records' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newAtt = mapDbAttendanceToAttendance(payload.new);
            setAttendanceRecords((prev) => [newAtt, ...prev.filter((a) => a.id !== newAtt.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedAtt = mapDbAttendanceToAttendance(payload.new);
            setAttendanceRecords((prev) =>
              prev.map((a) => (a.id === updatedAtt.id ? updatedAtt : a))
            );
          } else if (payload.eventType === 'DELETE') {
            setAttendanceRecords((prev) => prev.filter((a) => a.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'codex_transactions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTx = mapDbTxToTx(payload.new);
            setTransactions((prev) => [newTx, ...prev.filter((tx) => tx.id !== newTx.id)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshFromBackend]);

  const currentStudent = useMemo(() => {
    if (!currentStudentId) return null;
    return students.find((s) => s.id === currentStudentId || s.tokenId.toUpperCase() === currentStudentId.toUpperCase()) || null;
  }, [students, currentStudentId]);

  // Attendance metrics calculation
  const stats = useMemo<CampStats>(() => {
    const total = students.length;
    if (total === 0) return { totalStudents: 0, presentToday: 0, absentToday: 0, attendanceRate: 0 };

    let present = 0;
    students.forEach((stu) => {
      const rec = attendanceRecords.find((a) => a.studentId === stu.id && a.date === todayStr);
      if (rec && rec.status === 'PRESENT') {
        present++;
      }
    });

    const absent = total - present;
    const rate = Math.round((present / total) * 100);

    return {
      totalStudents: total,
      presentToday: present,
      absentToday: absent,
      attendanceRate: rate,
    };
  }, [students, attendanceRecords, todayStr]);

  const openStudentAuth = () => {
    setAuthModalTab('student');
    setAuthModalOpen(true);
  };

  const openAdminAuth = () => {
    setAuthModalTab('admin');
    setAuthModalOpen(true);
  };

  // Login with token — now async to support real-time Supabase lookup
  const loginWithToken = async (tokenInput: string) => {
    if (!checkRateLimit('login_student', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many login attempts. Please wait a moment.' };
    }

    const cleanToken = tokenInput.trim().toUpperCase();
    if (!cleanToken) {
      return { success: false, message: 'Please enter your access token.' };
    }

    // First check in-memory state
    let tokenObj = tokens.find((t) => t.token.toUpperCase() === cleanToken);

    // If not found in memory, try fetching directly from Supabase
    if (!tokenObj) {
      try {
        const { data } = await supabase
          .from('tokens')
          .select('*')
          .eq('token', cleanToken)
          .single();

        if (data) {
          const mappedToken = mapDbTokenToToken(data);
          setTokens((prev) => [mappedToken, ...prev.filter((t) => t.token !== mappedToken.token)]);
          tokenObj = mappedToken;
        }
      } catch {
        // Token not found in Supabase either
      }
    }

    if (!tokenObj) {
      return {
        success: false,
        message: 'Invalid access token. Please verify your code or contact the Oxford camp instructor.',
      };
    }

    // Check if onboarded
    if (!tokenObj.isOnboarded) {
      setPendingOnboardingToken(tokenObj.token);
      setAuthModalOpen(false);
      return { success: true, needsOnboarding: true };
    }

    // Find student
    const student = students.find((s) => s.tokenId.toUpperCase() === cleanToken || s.id === tokenObj!.studentId);
    if (!student) {
      // Student may not be in memory yet, try fetching from Supabase
      if (tokenObj.studentId) {
        try {
          const { data } = await supabase
            .from('students')
            .select('*')
            .eq('id', tokenObj.studentId)
            .single();

          if (data) {
            const mappedStudent = mapDbStudentToStudent(data);
            setStudents((prev) => [mappedStudent, ...prev.filter((s) => s.id !== mappedStudent.id)]);
            setCurrentStudentId(mappedStudent.id);
            setIsAdminLoggedIn(false);
            setPendingOnboardingToken(null);
            setAuthModalOpen(false);
            setTimeout(() => markAttendanceSelf(mappedStudent.id), 100);
            return { success: true };
          }
        } catch {
          // Student not found
        }
      }

      setPendingOnboardingToken(tokenObj.token);
      setAuthModalOpen(false);
      return { success: true, needsOnboarding: true };
    }

    setCurrentStudentId(student.id);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);
    setAuthModalOpen(false);
    setTimeout(() => markAttendanceSelf(student.id), 100);
    return { success: true };
  };

  const signupStudent = async (data: {
    tokenCode: string;
    password: string;
    fullName: string;
    grade: string;
    section: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!checkRateLimit('signup_student', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many signup attempts. Please wait a moment.' };
    }

    const cleanCode = data.tokenCode.trim().toUpperCase();
    const cleanPass = data.password.trim();

    if (!cleanCode || !cleanPass) {
      return { success: false, message: 'Please enter your login code and password.' };
    }

    if (!data.fullName.trim()) {
      return { success: false, message: 'Please enter your full name.' };
    }

    // Check if student with token already exists
    const existingStu = students.find((s) => s.tokenId.toUpperCase() === cleanCode);
    if (existingStu && existingStu.password && existingStu.password !== cleanPass) {
      return { success: false, message: 'This login code is already registered with a different password. Please log in.' };
    }

    const studentId = existingStu?.id || `stu_${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      tokenId: cleanCode,
      fullName: data.fullName.trim(),
      grade: data.grade,
      section: data.section,
      schoolName: existingStu?.schoolName || 'Oxford Secondary School',
      parentPhone: existingStu?.parentPhone || '',
      isOnboarded: true,
      codexBalance: existingStu ? existingStu.codexBalance : 50,
      registeredAt: existingStu?.registeredAt || todayStr,
      track: existingStu?.track || 'Full-Stack Web Development',
      password: cleanPass,
    };

    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== studentId)]);
    setTokens((prev) =>
      prev.map((t) =>
        t.token.toUpperCase() === cleanCode
          ? { ...t, isOnboarded: true, studentId, studentName: data.fullName.trim() }
          : t
      )
    );

    setCurrentStudentId(studentId);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);
    setAuthModalOpen(false);

    setTimeout(() => markAttendanceSelf(studentId), 100);

    try {
      await supabase.from('students').upsert({
        id: studentId,
        token_id: cleanCode,
        full_name: data.fullName.trim(),
        grade: data.grade,
        section: data.section,
        password: cleanPass,
        is_onboarded: true,
        codex_balance: newStudent.codexBalance,
        registered_at: newStudent.registeredAt,
      } as any);
      await supabase
        .from('tokens')
        .update({ is_onboarded: true, student_id: studentId, student_name: data.fullName.trim() })
        .eq('token', cleanCode);
    } catch (err) {
      console.warn('Supabase signup sync notice:', err);
    }

    return { success: true };
  };

  const loginStudentWithPassword = async (
    tokenCode: string,
    passwordInput: string
  ): Promise<{ success: boolean; message?: string }> => {
    if (!checkRateLimit('login_student', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many login attempts. Please wait a moment.' };
    }

    const cleanCode = tokenCode.trim().toUpperCase();
    const cleanPass = passwordInput.trim();

    if (!cleanCode || !cleanPass) {
      return { success: false, message: 'Please enter your login code and password.' };
    }

    let student = students.find(
      (s) => s.tokenId.toUpperCase() === cleanCode || s.id.toUpperCase() === cleanCode
    );

    if (!student) {
      try {
        const { data } = await supabase
          .from('students')
          .select('*')
          .or(`token_id.eq.${cleanCode},id.eq.${cleanCode}`)
          .single();
        if (data) {
          student = mapDbStudentToStudent(data);
          setStudents((prev) => [student!, ...prev.filter((s) => s.id !== student!.id)]);
        }
      } catch {
        // Not found in Supabase
      }
    }

    if (!student) {
      const tokenObj = tokens.find((t) => t.token.toUpperCase() === cleanCode);
      if (tokenObj) {
        return {
          success: false,
          message: 'This login code has not been registered yet. Please click "Sign Up" to register your account.',
        };
      }
      return {
        success: false,
        message: 'Invalid login code. Please check your token code or contact your teacher.',
      };
    }

    if (student.password && student.password !== cleanPass) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    if (!student.password) {
      student.password = cleanPass;
      updateStudentProfile(student.id, { password: cleanPass });
    }

    setCurrentStudentId(student.id);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);
    setAuthModalOpen(false);

    setTimeout(() => markAttendanceSelf(student.id), 100);
    return { success: true };
  };

  const loginAdmin = async (user: string, pass: string) => {
    if (!checkRateLimit('login_admin', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many login attempts. Please wait a moment.' };
    }

    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();

    try {
      const { data, error } = await supabase.rpc('check_admin_credentials', {
        p_username: trimmedUser,
        p_password: trimmedPass
      });

      if (data === true) {
        setIsAdminLoggedIn(true);
        setCurrentStudentId(null);
        setPendingOnboardingToken(null);
        setAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      console.error('Admin login error:', err);
    }

    return {
      success: false,
      message: 'Invalid administrator credentials.',
    };
  };

  const logout = () => {
    setCurrentStudentId(null);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);
  };

  const completeOnboarding = async (data: {
    fullName: string;
    grade: string;
    section: string;
    schoolName: string;
    parentPhone: string;
    track?: string;
  }) => {
    if (!pendingOnboardingToken) return;

    const tokenCode = pendingOnboardingToken.trim().toUpperCase();
    const newStudentId = `stu_${Date.now()}`;
    const cleanSchool = data.schoolName.trim() || 'Oxford Secondary School';
    const chosenTrack = data.track || 'Full-Stack Web Development';

    const newStudent: Student = {
      id: newStudentId,
      tokenId: tokenCode,
      fullName: data.fullName.trim(),
      grade: data.grade,
      section: data.section.trim(),
      schoolName: cleanSchool,
      parentPhone: data.parentPhone.trim(),
      isOnboarded: true,
      codexBalance: 50,
      registeredAt: todayStr,
      track: chosenTrack,
    };

    // Optimistic UI state updates
    setStudents((prev) => [newStudent, ...prev]);
    setTokens((prev) =>
      prev.map((t) =>
        t.token.toUpperCase() === tokenCode
          ? { ...t, isOnboarded: true, studentId: newStudentId, studentName: data.fullName }
          : t
      )
    );

    const initialAttendance: AttendanceRecord = {
      id: `att_${newStudentId}_today`,
      studentId: newStudentId,
      date: todayStr,
      status: 'ABSENT',
      checkInTime: null,
      verifiedBy: 'ADMIN',
      timestamp: Date.now(),
    };
    setAttendanceRecords((prev) => [initialAttendance, ...prev]);

    const welcomeTx: CodexTransaction = {
      id: `tx_${Date.now()}`,
      studentId: newStudentId,
      amount: 50,
      type: 'EARNED',
      reason: 'Welcome Registration Grant (CODEX Points)',
      date: todayStr,
    };
    setTransactions((prev) => [welcomeTx, ...prev]);

    setCurrentStudentId(newStudentId);
    setPendingOnboardingToken(null);

    // Call Supabase RPC backend function
    try {
      const { data: rpcResult, error } = await supabase.rpc('complete_student_onboarding', {
        p_token: tokenCode,
        p_full_name: data.fullName.trim(),
        p_grade: data.grade,
        p_section: data.section.trim(),
        p_school_name: cleanSchool,
        p_parent_phone: data.parentPhone.trim(),
        p_track: chosenTrack,
        p_today_str: todayStr,
      });

      if (error) {
        console.warn('Supabase onboarding RPC notice:', error.message);
        // Fallback to table inserts if RPC fails
        await supabase.from('students').upsert({
          id: newStudentId,
          token_id: tokenCode,
          full_name: data.fullName.trim(),
          grade: data.grade,
          section: data.section.trim(),
          school_name: cleanSchool,
          parent_phone: data.parentPhone.trim(),
          is_onboarded: true,
          codex_balance: 50,
          registered_at: todayStr,
          track: chosenTrack,
        });

        await supabase
          .from('tokens')
          .update({ is_onboarded: true, student_id: newStudentId, student_name: data.fullName })
          .eq('token', tokenCode);

        await supabase.from('attendance_records').upsert({
          id: initialAttendance.id,
          student_id: newStudentId,
          date: todayStr,
          status: 'ABSENT',
          verified_by: 'ADMIN',
          timestamp: initialAttendance.timestamp,
        });

        await supabase.from('codex_transactions').insert({
          id: welcomeTx.id,
          student_id: newStudentId,
          amount: 50,
          type: 'EARNED',
          reason: welcomeTx.reason,
          date: todayStr,
        });
      } else if (rpcResult && typeof rpcResult === 'object') {
        const persisted = rpcResult as any;
        if (persisted.id) {
          setCurrentStudentId(persisted.id);
        }
      }
    } catch (err) {
      console.warn('Backend sync exception in onboarding:', err);
    }
  };

  const cancelOnboarding = () => {
    setPendingOnboardingToken(null);
  };

  const updateStudentProfile = async (studentId: string, updates: Partial<Student>) => {
    // Optimistic update
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );

    try {
      const dbUpdates: any = {};
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
      if (updates.section !== undefined) dbUpdates.section = updates.section;
      if (updates.schoolName !== undefined) dbUpdates.school_name = updates.schoolName;
      if (updates.parentPhone !== undefined) dbUpdates.parent_phone = updates.parentPhone;
      if (updates.track !== undefined) dbUpdates.track = updates.track;
      if (updates.codexBalance !== undefined) dbUpdates.codex_balance = updates.codexBalance;
      dbUpdates.updated_at = new Date().toISOString();

      await supabase.from('students').update(dbUpdates).eq('id', studentId);
    } catch (err) {
      console.warn('Failed to persist student profile to Supabase:', err);
    }
  };

  const markAttendanceSelf = async (studentId: string) => {
    if (!checkRateLimit(`checkin_${studentId}`, { maxRequests: 1, windowMs: 10000 })) {
      return; // prevent spam click
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const existing = attendanceRecords.find(
      (a) => a.studentId === studentId && a.date === todayStr
    );

    if (existing && existing.status === 'PRESENT') {
      return; // Already present
    }

    // Optimistic UI state updates
    if (existing) {
      setAttendanceRecords((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? { ...a, status: 'PRESENT', checkInTime: formattedTime, verifiedBy: 'SELF', timestamp: Date.now() }
            : a
        )
      );
    } else {
      const newRec: AttendanceRecord = {
        id: `att_${studentId}_${Date.now()}`,
        studentId,
        date: todayStr,
        status: 'PRESENT',
        checkInTime: formattedTime,
        verifiedBy: 'SELF',
        timestamp: Date.now(),
      };
      setAttendanceRecords((prev) => [newRec, ...prev]);
    }

    // Award +10 CODEX tokens
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, codexBalance: s.codexBalance + 10 } : s
      )
    );

    // Record transaction
    const newTx: CodexTransaction = {
      id: `tx_${Date.now()}`,
      studentId,
      amount: 10,
      type: 'EARNED',
      reason: `Daily Attendance Check-in (${todayStr})`,
      date: todayStr,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Supabase RPC invocation
    try {
      const { error } = await supabase.rpc('mark_attendance_self', {
        p_student_id: studentId,
        p_date: todayStr,
        p_check_in_time: formattedTime,
      });

      if (error) {
        console.warn('mark_attendance_self RPC fallback:', error.message);
        // Direct table upsert fallback
        await supabase.from('attendance_records').upsert({
          id: existing?.id || `att_${studentId}_${Date.now()}`,
          student_id: studentId,
          date: todayStr,
          status: 'PRESENT',
          check_in_time: formattedTime,
          verified_by: 'SELF',
          timestamp: Date.now(),
        });
        const currentStu = students.find((s) => s.id === studentId);
        if (currentStu) {
          await supabase
            .from('students')
            .update({ codex_balance: currentStu.codexBalance + 10 })
            .eq('id', studentId);
        }
      }
    } catch (err) {
      console.warn('Attendance sync exception:', err);
    }
  };

  const adminToggleAttendance = async (
    studentId: string,
    date: string,
    newStatus: AttendanceStatus
  ) => {
    const existing = attendanceRecords.find(
      (a) => a.studentId === studentId && a.date === date
    );

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const checkInTime = newStatus === 'PRESENT' ? (existing?.checkInTime || formattedTime) : null;
    const nowTs = Date.now();
    const recId = existing?.id || `att_${studentId}_${date}_${nowTs}`;

    // Optimistic UI updates
    if (existing) {
      setAttendanceRecords((prev) =>
        prev.map((a) =>
          a.id === existing.id
            ? {
                ...a,
                status: newStatus,
                checkInTime,
                verifiedBy: 'ADMIN',
                timestamp: nowTs,
              }
            : a
        )
      );
    } else {
      const newRec: AttendanceRecord = {
        id: recId,
        studentId,
        date,
        status: newStatus,
        checkInTime,
        verifiedBy: 'ADMIN',
        timestamp: nowTs,
      };
      setAttendanceRecords((prev) => [newRec, ...prev]);
    }

    // Persist to Supabase
    try {
      await supabase.from('attendance_records').upsert({
        id: recId,
        student_id: studentId,
        date,
        status: newStatus,
        check_in_time: checkInTime,
        verified_by: 'ADMIN',
        timestamp: nowTs,
      });
    } catch (err) {
      console.warn('Failed to toggle attendance in Supabase:', err);
    }
  };

  const adminGenerateToken = (assignedGrade?: string, studentName?: string) => {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newTokenStr = `OXF-2026-${randomHex}`;

    const newRecord: TokenRecord = {
      token: newTokenStr,
      isOnboarded: false,
      createdAt: todayStr,
      assignedGrade: assignedGrade || 'Grade 10',
      studentName: studentName || undefined,
    };

    setTokens((prev) => [newRecord, ...prev]);

    // Persist to Supabase
    supabase
      .from('tokens')
      .insert({
        token: newTokenStr,
        is_onboarded: false,
        created_at: todayStr,
        assigned_grade: assignedGrade || 'Grade 10',
        student_name: studentName || null,
      })
      .then(({ error }) => {
        if (error) console.warn('Failed to insert token into Supabase:', error.message);
      });

    return newTokenStr;
  };

  const adminRevokeToken = async (tokenStr: string) => {
    setTokens((prev) => prev.filter((t) => t.token !== tokenStr));

    try {
      await supabase.from('tokens').delete().eq('token', tokenStr);
    } catch (err) {
      console.warn('Failed to delete token from Supabase:', err);
    }
  };

  const exportAttendanceCSV = () => {
    const headers = [
      'Student Name',
      'Token Code',
      'Class',
      'Section',
      'School Name',
      'Parent Contact',
      'Date',
      'Status',
      'Check-in Time',
      'Verified By',
      'CODEX Points',
    ];

    const rows = students.map((stu) => {
      const att = attendanceRecords.find((a) => a.studentId === stu.id && a.date === todayStr);
      return [
        `"${stu.fullName.replace(/"/g, '""')}"`,
        `"${stu.tokenId}"`,
        `"${stu.grade}"`,
        `"${stu.section}"`,
        `"${stu.schoolName}"`,
        `"${stu.parentPhone}"`,
        `"${todayStr}"`,
        `"${att?.status || 'ABSENT'}"`,
        `"${att?.checkInTime || '-'}"`,
        `"${att?.verifiedBy || 'SYSTEM'}"`,
        `"${stu.codexBalance}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Oxford_Camp_Attendance_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addOrUpdateStudent = async (input: {
    fullName: string;
    token?: string;
    studentClass: string;
    section: string;
    assignedGrade: string;
    points: number;
  }): Promise<Student> => {
    let cleanToken = (input.token || '').trim().toUpperCase();
    if (!cleanToken) {
      const unused = tokens.find((t) => !t.isOnboarded);
      cleanToken = unused ? unused.token : adminGenerateToken(input.assignedGrade, input.fullName);
    }

    const existing = students.find(
      (s) => s.tokenId.toUpperCase() === cleanToken || s.fullName.toLowerCase() === input.fullName.toLowerCase()
    );

    const studentId = existing?.id || `stu_${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      tokenId: cleanToken,
      fullName: input.fullName.trim(),
      grade: input.studentClass,
      section: input.section,
      schoolName: existing?.schoolName || 'Oxford Secondary School',
      parentPhone: existing?.parentPhone || '',
      isOnboarded: true,
      codexBalance: input.points,
      registeredAt: existing?.registeredAt || todayStr,
      track: existing?.track || 'Full-Stack Web Development',
    };

    setStudents((prev) => [newStudent, ...prev.filter((s) => s.id !== studentId)]);
    setTokens((prev) =>
      prev.map((t) =>
        t.token.toUpperCase() === cleanToken
          ? { ...t, isOnboarded: true, studentId, studentName: input.fullName.trim() }
          : t
      )
    );

    try {
      await supabase.from('students').upsert({
        id: studentId,
        token_id: cleanToken,
        full_name: input.fullName.trim(),
        grade: input.studentClass,
        section: input.section,
        codex_balance: input.points,
        is_onboarded: true,
        registered_at: newStudent.registeredAt,
      });
      await supabase
        .from('tokens')
        .update({ is_onboarded: true, student_id: studentId, student_name: input.fullName.trim() })
        .eq('token', cleanToken);
    } catch (err) {
      console.warn('Failed to persist addOrUpdateStudent to Supabase:', err);
    }

    return newStudent;
  };

  const markAttendance = async (studentToken: string, date: string, present: boolean): Promise<void> => {
    const cleanToken = studentToken.trim().toUpperCase();
    const student = students.find((s) => s.tokenId.toUpperCase() === cleanToken || s.id === cleanToken);
    if (!student) {
      throw new Error(`Student with token "${studentToken}" not found.`);
    }
    await adminToggleAttendance(student.id, date, present ? 'PRESENT' : 'ABSENT');
  };

  const adjustCodexPoints = async (studentToken: string, delta: number): Promise<void> => {
    const cleanToken = studentToken.trim().toUpperCase();
    const student = students.find((s) => s.tokenId.toUpperCase() === cleanToken || s.id === cleanToken);
    if (!student) {
      throw new Error(`Student with token "${studentToken}" not found.`);
    }

    const newBalance = Math.max(0, student.codexBalance + delta);

    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, codexBalance: newBalance } : s))
    );

    const txType: 'EARNED' | 'REDEEMED' = delta >= 0 ? 'EARNED' : 'REDEEMED';
    const newTx: CodexTransaction = {
      id: `tx_${Date.now()}`,
      studentId: student.id,
      amount: Math.abs(delta),
      type: txType,
      reason: `Admin adjustment (${delta > 0 ? '+' : ''}${delta} points)`,
      date: todayStr,
    };
    setTransactions((prev) => [newTx, ...prev]);

    try {
      await supabase.from('students').update({ codex_balance: newBalance }).eq('id', student.id);
      await supabase.from('codex_transactions').insert({
        id: newTx.id,
        student_id: student.id,
        amount: Math.abs(delta),
        type: txType,
        reason: newTx.reason,
        date: todayStr,
      });
    } catch (err) {
      console.warn('Failed to persist adjustCodexPoints to Supabase:', err);
    }
  };

  const exportAttendance = async (endDate?: string): Promise<void> => {
    const wb = XLSX.utils.book_new();
    const headers = [
      'Student Name',
      'Token Code',
      'Class',
      'Section',
      'School Name',
      'Parent Contact',
      'Status',
      'Check-in Time',
      'CODEX Points',
    ];

    const rows = students.map((stu) => {
      const att = attendanceRecords.find((a) => a.studentId === stu.id && a.date === todayStr);
      return [
        stu.fullName,
        stu.tokenId,
        stu.grade,
        stu.section,
        stu.schoolName,
        stu.parentPhone,
        att?.status || 'ABSENT',
        att?.checkInTime || '-',
        stu.codexBalance,
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, `Attendance_${todayStr}`);
    XLSX.writeFile(wb, `Oxford_Camp_Attendance_${todayStr}.xlsx`);
  };

  const resetDemoData = async () => {
    // Clear only session state from localStorage
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    localStorage.removeItem(STORAGE_KEYS.PENDING_TOKEN);

    // Also clear old legacy keys if they exist
    localStorage.removeItem('oxf_camp_students_v1');
    localStorage.removeItem('oxf_camp_tokens_v1');
    localStorage.removeItem('oxf_camp_attendance_v1');
    localStorage.removeItem('oxf_camp_tx_v1');

    setCurrentStudentId(null);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);

    // Re-fetch clean dataset from Supabase
    await refreshFromBackend();
  };

  return (
    <CampContext.Provider
      value={{
        students,
        tokens,
        attendanceRecords,
        transactions,
        currentStudent,
        isAdminLoggedIn,
        pendingOnboardingToken,
        authModalOpen,
        authModalTab,
        stats,
        todayStr,
        isBackendConnected,
        isLoading,
        setAuthModalOpen,
        setAuthModalTab,
        openStudentAuth,
        openAdminAuth,
        loginWithToken,
        signupStudent,
        loginStudentWithPassword,
        loginAdmin,
        logout,
        completeOnboarding,
        cancelOnboarding,
        updateStudentProfile,
        markAttendanceSelf,
        adminToggleAttendance,
        adminGenerateToken,
        adminRevokeToken,
        exportAttendanceCSV,
        addOrUpdateStudent,
        markAttendance,
        adjustCodexPoints,
        exportAttendance,
        resetDemoData,
        refreshFromBackend,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export const useCamp = () => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }
  return context;
};
