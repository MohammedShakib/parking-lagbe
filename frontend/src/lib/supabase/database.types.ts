export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AccountStatus = "verified" | "unverified";
export type DashboardType = "business" | "user";
export type UserLevel = "bronze" | "gold" | "diamond";
export type OwnerAccountStatus = "active" | "suspended" | "inactive";
export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type PaymentMethod = "bkash" | "nagad" | "card" | "points" | "cash" | "other";
export type TransactionType = "earned" | "spent" | "refunded" | "adjustment";
export type VerificationStatus = "pending" | "under_review" | "approved" | "rejected";
export type GarageStatus = "available" | "busy" | "closed";
export type OwnerType = "garage" | "dual";

export type UserRole = "admin" | "garage_owner" | "dual_user" | "regular_user" | "anonymous";

export interface Database {
  public: {
    Tables: {
      account_information: {
        Row: {
          username: string;
          auth_user_id: string | null;
          status: AccountStatus;
          owner_id: string | null;
          default_dashboard: DashboardType | null;
          registration_date: string;
          last_login: string | null;
          points: number;
          user_level: UserLevel;
          total_earned_points: number;
          level_updated_at: string | null;
        };
        Insert: {
          username: string;
          auth_user_id?: string | null;
          status?: AccountStatus;
          owner_id?: string | null;
          default_dashboard?: DashboardType | null;
          registration_date?: string;
          last_login?: string | null;
          points?: number;
          user_level?: UserLevel;
          total_earned_points?: number;
          level_updated_at?: string | null;
        };
        Update: {
          username?: string;
          auth_user_id?: string | null;
          status?: AccountStatus;
          owner_id?: string | null;
          default_dashboard?: DashboardType | null;
          registration_date?: string;
          last_login?: string | null;
          points?: number;
          user_level?: UserLevel;
          total_earned_points?: number;
          level_updated_at?: string | null;
        };
        Relationships: [];
      };
      personal_information: {
        Row: {
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          address: string | null;
          username: string;
        };
        Insert: {
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          address?: string | null;
          username: string;
        };
        Update: {
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          address?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "personal_information_username_fkey";
            columns: ["username"];
            isOneToOne: true;
            referencedRelation: "account_information";
            referencedColumns: ["username"];
          }
        ];
      };
      garage_owners: {
        Row: {
          owner_id: string;
          username: string;
          is_verified: boolean;
          registration_date: string;
          last_login: string | null;
          account_status: OwnerAccountStatus;
        };
        Insert: {
          owner_id: string;
          username: string;
          is_verified?: boolean;
          registration_date?: string;
          last_login?: string | null;
          account_status?: OwnerAccountStatus;
        };
        Update: {
          owner_id?: string;
          username?: string;
          is_verified?: boolean;
          registration_date?: string;
          last_login?: string | null;
          account_status?: OwnerAccountStatus;
        };
        Relationships: [
          {
            foreignKeyName: "garage_owners_username_fkey";
            columns: ["username"];
            isOneToOne: true;
            referencedRelation: "account_information";
            referencedColumns: ["username"];
          }
        ];
      };
      dual_user: {
        Row: {
          owner_id: string;
          username: string;
          is_verified: boolean;
          registration_date: string;
          last_login: string | null;
          account_status: OwnerAccountStatus;
        };
        Insert: {
          owner_id: string;
          username: string;
          is_verified?: boolean;
          registration_date?: string;
          last_login?: string | null;
          account_status?: OwnerAccountStatus;
        };
        Update: {
          owner_id?: string;
          username?: string;
          is_verified?: boolean;
          registration_date?: string;
          last_login?: string | null;
          account_status?: OwnerAccountStatus;
        };
        Relationships: [
          {
            foreignKeyName: "dual_user_username_fkey";
            columns: ["username"];
            isOneToOne: true;
            referencedRelation: "account_information";
            referencedColumns: ["username"];
          }
        ];
      };
      garagelocation: {
        Row: {
          garage_id: string;
          latitude: number;
          longitude: number;
          username: string;
        };
        Insert: {
          garage_id: string;
          latitude: number;
          longitude: number;
          username: string;
        };
        Update: {
          garage_id?: string;
          latitude?: number;
          longitude?: number;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "garagelocation_username_fkey";
            columns: ["username"];
            isOneToOne: false;
            referencedRelation: "account_information";
            referencedColumns: ["username"];
          }
        ];
      };
      garage_information: {
        Row: {
          id: number;
          username: string;
          garage_id: string;
          parking_space_name: string;
          parking_lot_address: string;
          parking_type: string | null;
          parking_space_dimensions: string | null;
          parking_capacity: number;
          availability: number;
          price_per_hour: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          username: string;
          garage_id: string;
          parking_space_name: string;
          parking_lot_address: string;
          parking_type?: string | null;
          parking_space_dimensions?: string | null;
          parking_capacity: number;
          availability?: number;
          price_per_hour?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          username?: string;
          garage_id?: string;
          parking_space_name?: string;
          parking_lot_address?: string;
          parking_type?: string | null;
          parking_space_dimensions?: string | null;
          parking_capacity?: number;
          availability?: number;
          price_per_hour?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "garage_information_garage_id_fkey";
            columns: ["garage_id"];
            isOneToOne: true;
            referencedRelation: "garagelocation";
            referencedColumns: ["garage_id"];
          }
        ];
      };
      garage_operating_schedule: {
        Row: {
          garage_id: string;
          garage_name: string | null;
          opening_time: string | null;
          closing_time: string | null;
          operating_days: string[];
          is_24_7: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          garage_id: string;
          garage_name?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          operating_days?: string[];
          is_24_7?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          garage_id?: string;
          garage_name?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          operating_days?: string[];
          is_24_7?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "garage_operating_schedule_garage_id_fkey";
            columns: ["garage_id"];
            isOneToOne: true;
            referencedRelation: "garage_information";
            referencedColumns: ["garage_id"];
          }
        ];
      };
      garage_real_time_status: {
        Row: {
          garage_id: string;
          current_status: GarageStatus;
          is_manual_override: boolean;
          override_until: string | null;
          override_reason: string | null;
          force_closed: boolean;
          active_bookings_count: number;
          can_close_after: string | null;
          last_changed_at: string;
          changed_by: string | null;
        };
        Insert: {
          garage_id: string;
          current_status?: GarageStatus;
          is_manual_override?: boolean;
          override_until?: string | null;
          override_reason?: string | null;
          force_closed?: boolean;
          active_bookings_count?: number;
          can_close_after?: string | null;
          last_changed_at?: string;
          changed_by?: string | null;
        };
        Update: {
          garage_id?: string;
          current_status?: GarageStatus;
          is_manual_override?: boolean;
          override_until?: string | null;
          override_reason?: string | null;
          force_closed?: boolean;
          active_bookings_count?: number;
          can_close_after?: string | null;
          last_changed_at?: string;
          changed_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "garage_real_time_status_garage_id_fkey";
            columns: ["garage_id"];
            isOneToOne: true;
            referencedRelation: "garage_information";
            referencedColumns: ["garage_id"];
          }
        ];
      };
      vehicle_information: {
        Row: {
          license_plate: string;
          vehicle_type: string;
          make: string | null;
          model: string | null;
          color: string | null;
          username: string;
        };
        Insert: {
          license_plate: string;
          vehicle_type: string;
          make?: string | null;
          model?: string | null;
          color?: string | null;
          username: string;
        };
        Update: {
          license_plate?: string;
          vehicle_type?: string;
          make?: string | null;
          model?: string | null;
          color?: string | null;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicle_information_username_fkey";
            columns: ["username"];
            isOneToOne: false;
            referencedRelation: "account_information";
            referencedColumns: ["username"];
          }
        ];
      };
      bookings: {
        Row: {
          id: number;
          username: string;
          garage_id: string;
          license_plate: string;
          booking_date: string;
          booking_time: string;
          duration: number;
          status: BookingStatus;
          payment_status: PaymentStatus;
          created_at: string;
          updated_at: string;
          paid_with_points: boolean;
          points_used: number;
        };
        Insert: {
          id?: number;
          username: string;
          garage_id: string;
          license_plate: string;
          booking_date: string;
          booking_time: string;
          duration: number;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          created_at?: string;
          updated_at?: string;
          paid_with_points?: boolean;
          points_used?: number;
        };
        Update: {
          id?: number;
          username?: string;
          garage_id?: string;
          license_plate?: string;
          booking_date?: string;
          booking_time?: string;
          duration?: number;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
          created_at?: string;
          updated_at?: string;
          paid_with_points?: boolean;
          points_used?: number;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          payment_id: number;
          booking_id: number;
          transaction_id: string | null;
          amount: number;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          payment_date: string;
          points_used: number;
        };
        Insert: {
          payment_id?: number;
          booking_id: number;
          transaction_id?: string | null;
          amount: number;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          payment_date?: string;
          points_used?: number;
        };
        Update: {
          payment_id?: number;
          booking_id?: number;
          transaction_id?: string | null;
          amount?: number;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          payment_date?: string;
          points_used?: number;
        };
        Relationships: [];
      };
      points_transactions: {
        Row: {
          id: number;
          username: string;
          transaction_type: TransactionType;
          points_amount: number;
          description: string | null;
          booking_id: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          username: string;
          transaction_type: TransactionType;
          points_amount: number;
          description?: string | null;
          booking_id?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          username?: string;
          transaction_type?: TransactionType;
          points_amount?: number;
          description?: string | null;
          booking_id?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_login_history: {
        Row: {
          id: number;
          username: string;
          login_time: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: number;
          username: string;
          login_time?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: number;
          username?: string;
          login_time?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_id?: string };
        Returns: boolean;
      };
      get_user_role: {
        Args: { auth_uid?: string };
        Returns: string;
      };
      record_login_history: {
        Args: { p_username: string; p_ip?: string | null; p_user_agent?: string | null };
        Returns: void;
      };
      switch_default_dashboard: {
        Args: { p_dashboard: DashboardType };
        Returns: void;
      };
    };
    Enums: {
      account_status: AccountStatus;
      dashboard_type: DashboardType;
      user_level: UserLevel;
      owner_account_status: OwnerAccountStatus;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      transaction_type: TransactionType;
      verification_status: VerificationStatus;
      garage_status: GarageStatus;
      owner_type: OwnerType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type ProfileWithAccount = {
  auth_user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  address: string | null;
  status: AccountStatus;
  owner_id: string | null;
  default_dashboard: DashboardType | null;
  points: number;
  user_level: UserLevel;
  total_earned_points: number;
  role: UserRole;
  is_verified_owner?: boolean;
};
