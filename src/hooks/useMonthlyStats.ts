import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useMonthlyStats = () => {
  const { user } = useAuth();
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [remindersSent, setRemindersSent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoading(true);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

      try {
        // Reminders sent this month
        const { count: remindersCount } = await supabase
          .from("reminders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "sent")
          .gte("reminder_time", startOfMonth)
          .lte("reminder_time", endOfMonth);

        const sent = remindersCount || 0;
        setRemindersSent(sent);

        // Contests attended (submissions) this month
        const { count: attendedCount } = await supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", startOfMonth)
          .lte("created_at", endOfMonth);

        const attended = attendedCount || 0;
        const rate = sent > 0 ? Math.round((attended / sent) * 100) : 0;
        setAttendanceRate(rate);
      } catch (err) {
        console.error("Error fetching monthly stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { attendanceRate, remindersSent, loading };
};
