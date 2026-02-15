import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  reminder_offsets: number[];
  notification_channels: Record<string, boolean>;
  subscription_status: "free" | "pro";
  rating_codeforces: number | null;
  rating_codechef: number | null;
  rating_leetcode: number | null;
  preferred_platforms: string[];
  auto_reminder_platforms: string[];
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          ...data,
          reminder_offsets: (data.reminder_offsets as number[]) || [30, 60],
          notification_channels: (data.notification_channels as Record<string, boolean>) || { email: true, browser: true, whatsapp: false },
          preferred_platforms: data.preferred_platforms || ["codeforces", "leetcode", "codechef", "atcoder"],
          auto_reminder_platforms: (data as any).auto_reminder_platforms || [],
        });
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      setIsAdmin(!!roleData);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Pick<Profile, "full_name" | "phone_number" | "reminder_offsets" | "notification_channels" | "rating_codeforces" | "rating_codechef" | "rating_leetcode" | "preferred_platforms" | "auto_reminder_platforms">>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...updates } : prev);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    }
  };

  return { profile, loading, isAdmin, updateProfile, refetch: fetchProfile };
};
