import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export interface Contest {
  id: string;
  name: string;
  platform: string;
  platformColor: string;
  platformInitial: string;
  startTime: Date;
  duration: string;
  link: string;
  isSubscribed: boolean;
}

const platformConfig: Record<string, { color: string; initial: string; displayName: string }> = {
  codeforces: { color: "from-blue-500 to-blue-600", initial: "CF", displayName: "Codeforces" },
  leetcode: { color: "from-amber-500 to-orange-500", initial: "LC", displayName: "LeetCode" },
  codechef: { color: "from-amber-600 to-yellow-500", initial: "CC", displayName: "CodeChef" },
  atcoder: { color: "from-gray-600 to-gray-700", initial: "AC", displayName: "AtCoder" },
  hacker_rank: { color: "from-green-500 to-emerald-600", initial: "HR", displayName: "HackerRank" },
  hacker_earth: { color: "from-indigo-500 to-purple-600", initial: "HE", displayName: "HackerEarth" },
  top_coder: { color: "from-cyan-500 to-blue-600", initial: "TC", displayName: "TopCoder" },
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours} hours`;
  return `${minutes} minutes`;
};

export const useContests = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { profile } = useProfile();

  // Load user's subscriptions from DB
  const loadSubscriptions = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("contest_subscriptions")
        .select("contest_id")
        .eq("user_id", user.id);

      if (data) {
        setSubscribedIds(new Set(data.map(s => s.contest_id)));
      }
    } catch (err) {
      console.error("Error loading subscriptions:", err);
    }
  }, [user]);

  const fetchContests = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: dbContests, error: dbError } = await supabase
        .from("contests")
        .select("*")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(50);

      if (dbError) throw new Error(dbError.message);

      if (dbContests && dbContests.length > 0) {
        const transformed = dbContests.map((contest) => {
          const site = contest.platform.toLowerCase().replace(/ /g, "_");
          const config = platformConfig[site] || {
            color: "from-gray-500 to-gray-600",
            initial: contest.platform.substring(0, 2).toUpperCase(),
            displayName: contest.platform,
          };

          return {
            id: contest.id,
            name: contest.name,
            platform: config.displayName,
            platformColor: config.color,
            platformInitial: config.initial,
            startTime: new Date(contest.start_time),
            duration: formatDuration(contest.duration),
            link: contest.url,
            isSubscribed: subscribedIds.has(contest.id),
          };
        });

        setContests(transformed);
        return;
      }

      // Fallback: if DB is empty, trigger sync
      console.log("DB empty, fetching from edge function...");
      const { data, error: funcError } = await supabase.functions.invoke('fetch-contests');
      if (funcError) throw new Error(funcError.message);

      const kontestsData = data?.contests || [];
      const transformed = kontestsData.map((contest: any, index: number) => {
        const site = contest.site.toLowerCase().replace(/ /g, "_");
        const config = platformConfig[site] || {
          color: "from-gray-500 to-gray-600",
          initial: contest.site.substring(0, 2).toUpperCase(),
          displayName: contest.site,
        };

        return {
          id: `${site}-${index}-${contest.name.substring(0, 10)}`,
          name: contest.name,
          platform: config.displayName,
          platformColor: config.color,
          platformInitial: config.initial,
          startTime: new Date(contest.start_time),
          duration: formatDuration(parseInt(contest.duration) || 0),
          link: contest.url,
          isSubscribed: false,
        };
      }).sort((a: Contest, b: Contest) => a.startTime.getTime() - b.startTime.getTime());

      setContests(transformed);
    } catch (err) {
      console.error("Error fetching contests:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  };

  // Auto-create reminders based on user's preferred offsets
  const createReminders = async (contestId: string) => {
    if (!user || !profile) return;

    const offsets = (profile.reminder_offsets as number[]) || [30, 60];
    const channels = profile.notification_channels as Record<string, boolean>;

    // Get contest start time
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return;

    const activeChannels = Object.entries(channels || {})
      .filter(([_, enabled]) => enabled)
      .map(([channel]) => channel);

    if (activeChannels.length === 0) {
      activeChannels.push("browser"); // default
    }

    const reminders = [];
    for (const offset of offsets) {
      for (const channel of activeChannels) {
        const reminderTime = new Date(contest.startTime.getTime() - offset * 60 * 1000);
        if (reminderTime > new Date()) {
          reminders.push({
            user_id: user.id,
            contest_id: contestId,
            reminder_time: reminderTime.toISOString(),
            channel,
            status: "pending" as const,
          });
        }
      }
    }

    if (reminders.length > 0) {
      const { error } = await supabase.from("reminders").insert(reminders);
      if (error) console.error("Error creating reminders:", error);
    }
  };

  const toggleSubscription = async (contestId: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe to contests");
      return;
    }

    const isCurrentlySubscribed = subscribedIds.has(contestId);

    // Optimistic update
    setSubscribedIds(prev => {
      const newSet = new Set(prev);
      if (isCurrentlySubscribed) newSet.delete(contestId);
      else newSet.add(contestId);
      return newSet;
    });
    setContests(prev =>
      prev.map(c => c.id === contestId ? { ...c, isSubscribed: !isCurrentlySubscribed } : c)
    );

    try {
      if (isCurrentlySubscribed) {
        // Unsubscribe: delete subscription + reminders
        await supabase
          .from("contest_subscriptions")
          .delete()
          .eq("user_id", user.id)
          .eq("contest_id", contestId);

        await supabase
          .from("reminders")
          .delete()
          .eq("user_id", user.id)
          .eq("contest_id", contestId);

        toast.success("Unsubscribed from contest");
      } else {
        // Subscribe: create subscription + reminders
        const { error } = await supabase
          .from("contest_subscriptions")
          .insert({ user_id: user.id, contest_id: contestId });

        if (error) throw error;

        await createReminders(contestId);
        toast.success("Subscribed! Reminders set 🔔");
      }
    } catch (err) {
      // Revert optimistic update
      setSubscribedIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlySubscribed) newSet.add(contestId);
        else newSet.delete(contestId);
        return newSet;
      });
      setContests(prev =>
        prev.map(c => c.id === contestId ? { ...c, isSubscribed: isCurrentlySubscribed } : c)
      );
      console.error("Subscription error:", err);
      toast.error("Failed to update subscription");
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  useEffect(() => {
    fetchContests();
    const interval = setInterval(fetchContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [subscribedIds]);

  return { contests, loading, error, refetch: fetchContests, toggleSubscription };
};
