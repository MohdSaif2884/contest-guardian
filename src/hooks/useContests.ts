import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const fetchContests = async () => {
    setLoading(true);
    setError(null);

    try {
      // Read directly from DB (synced by cron)
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

      // Fallback: if DB is empty, trigger sync via edge function
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

  const toggleSubscription = (contestId: string) => {
    setSubscribedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contestId)) newSet.delete(contestId);
      else newSet.add(contestId);
      return newSet;
    });

    setContests((prev) =>
      prev.map((contest) =>
        contest.id === contestId
          ? { ...contest, isSubscribed: !contest.isSubscribed }
          : contest
      )
    );
  };

  useEffect(() => {
    fetchContests();
    const interval = setInterval(fetchContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { contests, loading, error, refetch: fetchContests, toggleSubscription };
};
