export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      attendance_records: {
        Row: {
          check_in_time: string | null;
          created_at: string;
          date: string;
          id: string;
          status: 'PRESENT' | 'ABSENT';
          student_id: string;
          timestamp: number;
          verified_by: 'SELF' | 'ADMIN' | 'SYSTEM';
        };
        Insert: {
          check_in_time?: string | null;
          created_at?: string;
          date: string;
          id: string;
          status: 'PRESENT' | 'ABSENT';
          student_id: string;
          timestamp: number;
          verified_by?: 'SELF' | 'ADMIN' | 'SYSTEM';
        };
        Update: {
          check_in_time?: string | null;
          created_at?: string;
          date?: string;
          id?: string;
          status?: 'PRESENT' | 'ABSENT';
          student_id?: string;
          timestamp?: number;
          verified_by?: 'SELF' | 'ADMIN' | 'SYSTEM';
        };
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          }
        ];
      };
      codex_perks: {
        Row: {
          category: 'SWAG' | 'HARDWARE' | 'CERTIFICATION' | 'MENTORSHIP';
          cost: number;
          created_at: string;
          description: string;
          id: string;
          title: string;
          unlocked: boolean;
        };
        Insert: {
          category: 'SWAG' | 'HARDWARE' | 'CERTIFICATION' | 'MENTORSHIP';
          cost: number;
          created_at?: string;
          description: string;
          id: string;
          title: string;
          unlocked?: boolean;
        };
        Update: {
          category?: 'SWAG' | 'HARDWARE' | 'CERTIFICATION' | 'MENTORSHIP';
          cost?: number;
          created_at?: string;
          description?: string;
          id?: string;
          title?: string;
          unlocked?: boolean;
        };
        Relationships: [];
      };
      codex_transactions: {
        Row: {
          amount: number;
          created_at: string;
          date: string;
          id: string;
          reason: string;
          student_id: string;
          type: 'EARNED' | 'REDEEMED';
        };
        Insert: {
          amount: number;
          created_at?: string;
          date: string;
          id: string;
          reason: string;
          student_id: string;
          type: 'EARNED' | 'REDEEMED';
        };
        Update: {
          amount?: number;
          created_at?: string;
          date?: string;
          id?: string;
          reason?: string;
          student_id?: string;
          type?: 'EARNED' | 'REDEEMED';
        };
        Relationships: [
          {
            foreignKeyName: "codex_transactions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          }
        ];
      };
      students: {
        Row: {
          avatar_seed: string | null;
          codex_balance: number;
          created_at: string;
          full_name: string;
          grade: string;
          id: string;
          is_onboarded: boolean;
          parent_phone: string;
          registered_at: string;
          school_name: string;
          section: string;
          token_id: string;
          track: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_seed?: string | null;
          codex_balance?: number;
          created_at?: string;
          full_name: string;
          grade: string;
          id: string;
          is_onboarded?: boolean;
          parent_phone: string;
          registered_at?: string;
          school_name?: string;
          section: string;
          token_id: string;
          track?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_seed?: string | null;
          codex_balance?: number;
          created_at?: string;
          full_name?: string;
          grade?: string;
          id?: string;
          is_onboarded?: boolean;
          parent_phone?: string;
          registered_at?: string;
          school_name?: string;
          section?: string;
          token_id?: string;
          track?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tokens: {
        Row: {
          assigned_grade: string | null;
          created_at: string;
          is_onboarded: boolean;
          student_id: string | null;
          student_name: string | null;
          token: string;
        };
        Insert: {
          assigned_grade?: string | null;
          created_at?: string;
          is_onboarded?: boolean;
          student_id?: string | null;
          student_name?: string | null;
          token: string;
        };
        Update: {
          assigned_grade?: string | null;
          created_at?: string;
          is_onboarded?: boolean;
          student_id?: string | null;
          student_name?: string | null;
          token?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      complete_student_onboarding: {
        Args: {
          p_full_name: string;
          p_grade: string;
          p_parent_phone: string;
          p_school_name: string;
          p_section: string;
          p_today_str: string;
          p_token: string;
          p_track: string;
        };
        Returns: Json;
      };
      mark_attendance_self: {
        Args: {
          p_check_in_time: string;
          p_date: string;
          p_student_id: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
