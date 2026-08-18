import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Student, TokenRecord, AttendanceRecord, CodexTransaction, CampStats, AttendanceStatus } from '../types';
import { INITIAL_STUDENTS, INITIAL_TOKENS, INITIAL_ATTENDANCE, INITIAL_TRANSACTIONS, TODAY_STR } from '../data/initialData';
import { supabase } from '../lib/supabase';
import { checkRateLimit } from '../lib/rateLimit';

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
  setAuthModalOpen: (open: boolean) => void;
  setAuthModalTab: (tab: 'student' | 'admin') => void;
  openStudentAuth: () => void;
  openAdminAuth: () => void;
  loginWithToken: (tokenInput: string) => { success: boolean; needsOnboarding?: boolean; message?: string };
  loginAdmin: (user: string, pass: string) => { success: boolean; message?: string };
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
  adminGenerateToken: (assignedGrade?: string, studentName?: string) => string;
  adminRevokeToken: (tokenStr: string) => Promise<void> | void;
  exportAttendanceCSV: () => void;
  resetDemoData: () => Promise<void> | void;
  refreshFromBackend: () => Promise<void>;
}

const CampContext = createContext<CampContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'oxf_camp_students_v1',
  TOKENS: 'oxf_camp_tokens_v1',
  ATTENDANCE: 'oxf_camp_attendance_v1',
  TRANSACTIONS: 'oxf_camp_tx_v1',
  CURRENT_STUDENT_ID: 'oxf_camp_cur_student_id_v1',
  IS_ADMIN: 'oxf_camp_is_admin_v1',
  PENDING_TOKEN: 'oxf_camp_pending_token_v1',
};

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
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [tokens, setTokens] = useState<TokenRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOKENS);
      return saved ? JSON.parse(saved) : INITIAL_TOKENS;
    } catch {
      return INITIAL_TOKENS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [transactions, setTransactions] = useState<CodexTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

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

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
    } catch (e) {
      console.error(e);
    }
  }, [tokens]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
    } catch (e) {
      console.error(e);
    }
  }, [attendanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

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

  // Fetch all state from Supabase backend
  const refreshFromBackend = useCallback(async () => {
    try {
      const [stuRes, tokRes, attRes, txRes] = await Promise.all([
        supabase.from('students').select('*').order('created_at', { ascending: false }),
        supabase.from('tokens').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance_records').select('*').order('date', { ascending: false }),
        supabase.from('codex_transactions').select('*').order('created_at', { ascending: false }),
      ]);

      if (stuRes.data && stuRes.data.length > 0) {
        setStudents(stuRes.data.map(mapDbStudentToStudent));
      }
      if (tokRes.data && tokRes.data.length > 0) {
        setTokens(tokRes.data.map(mapDbTokenToToken));
      }
      if (attRes.data && attRes.data.length > 0) {
        setAttendanceRecords(attRes.data.map(mapDbAttendanceToAttendance));
      }
      if (txRes.data && txRes.data.length > 0) {
        setTransactions(txRes.data.map(mapDbTxToTx));
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.warn('Backend sync failed, maintaining local fallback:', err);
      setIsBackendConnected(false);
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
    return students.find((s) => s.id === currentStudentId) || null;
  }, [students, currentStudentId]);

  // Attendance metrics calculation
  const stats = useMemo<CampStats>(() => {
    const total = students.length;
    if (total === 0) return { totalStudents: 0, presentToday: 0, absentToday: 0, attendanceRate: 0 };

    let present = 0;
    students.forEach((stu) => {
      const rec = attendanceRecords.find((a) => a.studentId === stu.id && a.date === TODAY_STR);
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
  }, [students, attendanceRecords]);

  const openStudentAuth = () => {
    setAuthModalTab('student');
    setAuthModalOpen(true);
  };

  const openAdminAuth = () => {
    setAuthModalTab('admin');
    setAuthModalOpen(true);
  };

  const loginWithToken = (tokenInput: string) => {
    if (!checkRateLimit('login_student', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many login attempts. Please wait a moment.' };
    }

    const cleanToken = tokenInput.trim().toUpperCase();
    if (!cleanToken) {
      return { success: false, message: 'Please enter your access token.' };
    }

    const tokenObj = tokens.find((t) => t.token.toUpperCase() === cleanToken);
    if (!tokenObj) {
      // Direct fallback fetch in background
      supabase
        .from('tokens')
        .select('*')
        .eq('token', cleanToken)
        .single()
        .then(({ data }) => {
          if (data) {
            setTokens((prev) => [mapDbTokenToToken(data), ...prev]);
          }
        });

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
    const student = students.find((s) => s.tokenId.toUpperCase() === cleanToken || s.id === tokenObj.studentId);
    if (!student) {
      setPendingOnboardingToken(tokenObj.token);
      setAuthModalOpen(false);
      return { success: true, needsOnboarding: true };
    }

    setCurrentStudentId(student.id);
    setIsAdminLoggedIn(false);
    setPendingOnboardingToken(null);
    setAuthModalOpen(false);
    return { success: true };
  };

  const loginAdmin = (user: string, pass: string) => {
    if (!checkRateLimit('login_admin', { maxRequests: 5, windowMs: 60000 })) {
      return { success: false, message: 'Too many login attempts. Please wait a moment.' };
    }

    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();

    if (trimmedUser === 'admin' && trimmedPass === 'HenryCabil@26') {
      setIsAdminLoggedIn(true);
      setCurrentStudentId(null);
      setPendingOnboardingToken(null);
      setAuthModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid administrator credentials. Username is "admin" and password is "HenryCabil@26".',
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
      registeredAt: TODAY_STR,
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
      date: TODAY_STR,
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
      date: TODAY_STR,
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
        p_today_str: TODAY_STR,
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
          registered_at: TODAY_STR,
          track: chosenTrack,
        });

        await supabase
          .from('tokens')
          .update({ is_onboarded: true, student_id: newStudentId, student_name: data.fullName })
          .eq('token', tokenCode);

        await supabase.from('attendance_records').upsert({
          id: initialAttendance.id,
          student_id: newStudentId,
          date: TODAY_STR,
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
          date: TODAY_STR,
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
      (a) => a.studentId === studentId && a.date === TODAY_STR
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
        date: TODAY_STR,
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
      reason: `Daily Attendance Check-in (${TODAY_STR})`,
      date: TODAY_STR,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Supabase RPC invocation
    try {
      const { error } = await supabase.rpc('mark_attendance_self', {
        p_student_id: studentId,
        p_date: TODAY_STR,
        p_check_in_time: formattedTime,
      });

      if (error) {
        console.warn('mark_attendance_self RPC fallback:', error.message);
        // Direct table upsert fallback
        await supabase.from('attendance_records').upsert({
          id: existing?.id || `att_${studentId}_${Date.now()}`,
          student_id: studentId,
          date: TODAY_STR,
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
      createdAt: TODAY_STR,
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
        created_at: TODAY_STR,
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
      const att = attendanceRecords.find((a) => a.studentId === stu.id && a.date === TODAY_STR);
      return [
        `"${stu.fullName.replace(/"/g, '""')}"`,
        `"${stu.tokenId}"`,
        `"${stu.grade}"`,
        `"${stu.section}"`,
        `"${stu.schoolName}"`,
        `"${stu.parentPhone}"`,
        `"${TODAY_STR}"`,
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
    link.setAttribute('download', `Oxford_Camp_Attendance_${TODAY_STR}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetDemoData = async () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.TOKENS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
    localStorage.removeItem(STORAGE_KEYS.PENDING_TOKEN);

    setStudents(INITIAL_STUDENTS);
    setTokens(INITIAL_TOKENS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setTransactions(INITIAL_TRANSACTIONS);
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
        todayStr: TODAY_STR,
        isBackendConnected,
        setAuthModalOpen,
        setAuthModalTab,
        openStudentAuth,
        openAdminAuth,
        loginWithToken,
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
