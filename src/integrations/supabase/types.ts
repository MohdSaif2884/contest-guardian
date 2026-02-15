export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      contest_subscriptions: {
        Row: {
          contest_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          contest_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          contest_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_subscriptions_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string
          difficulty: string | null
          duration: number
          external_id: string | null
          id: string
          is_featured: boolean
          name: string
          platform: string
          start_time: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          duration?: number
          external_id?: string | null
          id?: string
          is_featured?: boolean
          name: string
          platform: string
          start_time: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          duration?: number
          external_id?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          platform?: string
          start_time?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auto_reminder_platforms: string[] | null
          created_at: string
          full_name: string | null
          id: string
          notification_channels: Json
          phone_number: string | null
          preferred_platforms: string[] | null
          rating_codechef: number | null
          rating_codeforces: number | null
          rating_leetcode: number | null
          reminder_offsets: Json
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_reminder_platforms?: string[] | null
          created_at?: string
          full_name?: string | null
          id?: string
          notification_channels?: Json
          phone_number?: string | null
          preferred_platforms?: string[] | null
          rating_codechef?: number | null
          rating_codeforces?: number | null
          rating_leetcode?: number | null
          reminder_offsets?: Json
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_reminder_platforms?: string[] | null
          created_at?: string
          full_name?: string | null
          id?: string
          notification_channels?: Json
          phone_number?: string | null
          preferred_platforms?: string[] | null
          rating_codechef?: number | null
          rating_codeforces?: number | null
          rating_leetcode?: number | null
          reminder_offsets?: Json
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          channel: string
          contest_id: string
          created_at: string
          id: string
          reminder_time: string
          status: Database["public"]["Enums"]["reminder_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          channel?: string
          contest_id: string
          created_at?: string
          id?: string
          reminder_time: string
          status?: Database["public"]["Enums"]["reminder_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          contest_id?: string
          created_at?: string
          id?: string
          reminder_time?: string
          status?: Database["public"]["Enums"]["reminder_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          contest_id: string
          created_at: string
          id: string
          rank: number | null
          rating_change: number | null
          solved: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contest_id: string
          created_at?: string
          id?: string
          rank?: number | null
          rating_change?: number | null
          solved?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contest_id?: string
          created_at?: string
          id?: string
          rank?: number | null
          rating_change?: number | null
          solved?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          completed_at: string | null
          contests_synced: number | null
          error_message: string | null
          id: string
          platform: string | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          contests_synced?: number | null
          error_message?: string | null
          id?: string
          platform?: string | null
          started_at?: string
          status?: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          contests_synced?: number | null
          error_message?: string | null
          id?: string
          platform?: string | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      reminder_status: "pending" | "sent" | "failed"
      subscription_status: "free" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      reminder_status: ["pending", "sent", "failed"],
      subscription_status: ["free", "pro"],
    },
  },
} as const
