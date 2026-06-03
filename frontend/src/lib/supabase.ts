import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Using local database fallback.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'siswa' | 'sekolah' | 'donatur';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          nisn: string;
          school: string;
          class: string;
          parent_name: string;
          address: string;
          spp_amount: number;
          status: 'active' | 'inactive';
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      bills: {
        Row: {
          id: string;
          student_id: string;
          month: string;
          year: number;
          due_date: string;
          total: number;
          status: 'Lunas' | 'Tertunggak' | 'Belum Bayar';
          payment_method: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bills']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bills']['Insert']>;
      };
      bill_items: {
        Row: {
          id: string;
          bill_id: string;
          name: string;
          amount: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bill_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bill_items']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          bill_id: string;
          student_id: string;
          amount: number;
          payment_method: string;
          status: 'pending' | 'completed' | 'failed';
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      loans: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          purpose: string;
          period_months: number;
          status: 'Pending' | 'Disetujui' | 'Ditolak' | 'Selesai';
          requested_at: string;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['loans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['loans']['Insert']>;
      };
      loan_installments: {
        Row: {
          id: string;
          loan_id: string;
          month: string;
          amount: number;
          status: 'Belum Bayar' | 'Lunas';
          due_date: string;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['loan_installments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['loan_installments']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          title: string;
          description: string;
          story: string;
          target: number;
          collected: number;
          school: string;
          location: string;
          category: string;
          image: string;
          verified: boolean;
          status: 'pending' | 'active' | 'completed' | 'rejected';
          start_date: string;
          end_date: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      donations: {
        Row: {
          id: string;
          campaign_id: string;
          donor_id: string;
          amount: number;
          payment_method: string;
          message: string | null;
          anonymous: boolean;
          status: 'completed' | 'pending' | 'failed';
          donated_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['donations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'payment' | 'loan' | 'campaign' | 'donation' | 'reminder' | 'system';
          read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
    };
  };
}
