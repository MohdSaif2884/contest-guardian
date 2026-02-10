import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminContest {
  id: string;
  platform: string;
  name: string;
  start_time: string;
  duration: number;
  url: string;
  difficulty: string | null;
  is_featured: boolean;
  external_id: string | null;
  created_at: string;
}

interface AdminStats {
  totalContests: number;
  totalReminders: number;
  pendingReminders: number;
  sentReminders: number;
}

export const useAdmin = () => {
  const [contests, setContests] = useState<AdminContest[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalContests: 0, totalReminders: 0, pendingReminders: 0, sentReminders: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [contestsRes, remindersRes] = await Promise.all([
        supabase.from("contests").select("*").order("start_time", { ascending: true }).limit(100),
        supabase.from("reminders").select("status").limit(1000),
      ]);

      if (contestsRes.data) setContests(contestsRes.data as AdminContest[]);

      const reminders = remindersRes.data || [];
      setStats({
        totalContests: contestsRes.data?.length || 0,
        totalReminders: reminders.length,
        pendingReminders: reminders.filter((r) => r.status === "pending").length,
        sentReminders: reminders.filter((r) => r.status === "sent").length,
      });
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFeatured = async (contestId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from("contests")
        .update({ is_featured: !isFeatured })
        .eq("id", contestId);

      if (error) throw error;

      setContests((prev) =>
        prev.map((c) => (c.id === contestId ? { ...c, is_featured: !isFeatured } : c))
      );
      toast.success(isFeatured ? "Contest unfeatured" : "Contest featured!");
    } catch (err) {
      toast.error("Failed to update contest");
    }
  };

  const deleteContest = async (contestId: string) => {
    try {
      const { error } = await supabase.from("contests").delete().eq("id", contestId);
      if (error) throw error;
      setContests((prev) => prev.filter((c) => c.id !== contestId));
      toast.success("Contest deleted");
    } catch (err) {
      toast.error("Failed to delete contest");
    }
  };

  return { contests, stats, loading, toggleFeatured, deleteContest, refetch: fetchData };
};
