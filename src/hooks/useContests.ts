import { useState, useEffect } from "react";

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

interface KontestsContest {
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  duration: string;
  site: string;
  in_24_hours: string;
  status: string;
}

const platformConfig: Record<string, { color: string; initial: string; displayName: string }> = {
  codeforces: { color: "from-blue-500 to-blue-600", initial: "CF", displayName: "Codeforces" },
  codeforces_gym: { color: "from-blue-400 to-blue-500", initial: "CF", displayName: "Codeforces Gym" },
  leetcode: { color: "from-amber-500 to-orange-500", initial: "LC", displayName: "LeetCode" },
  code_chef: { color: "from-amber-600 to-yellow-500", initial: "CC", displayName: "CodeChef" },
  at_coder: { color: "from-gray-600 to-gray-700", initial: "AC", displayName: "AtCoder" },
  hacker_rank: { color: "from-green-500 to-emerald-600", initial: "HR", displayName: "HackerRank" },
  hacker_earth: { color: "from-indigo-500 to-purple-600", initial: "HE", displayName: "HackerEarth" },
  kick_start: { color: "from-red-500 to-pink-600", initial: "KS", displayName: "Kick Start" },
  top_coder: { color: "from-cyan-500 to-blue-600", initial: "TC", displayName: "TopCoder" },
  cs_academy: { color: "from-violet-500 to-purple-600", initial: "CS", displayName: "CS Academy" },
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else {
    return `${minutes} minutes`;
  }
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
      // Fetch from Kontests API (free, no auth required)
      const response = await fetch("https://kontests.net/api/v1/all");
      
      if (!response.ok) {
        throw new Error("Failed to fetch contests");
      }

      const data: KontestsContest[] = await response.json();
      
      // Filter and transform contests
      const now = new Date();
      const transformedContests: Contest[] = data
        .filter((contest) => {
          const startTime = new Date(contest.start_time);
          // Only show upcoming contests (not already ended)
          return startTime > now || contest.status === "CODING";
        })
        .map((contest, index) => {
          const site = contest.site.toLowerCase().replace(/ /g, "_");
          const config = platformConfig[site] || {
            color: "from-gray-500 to-gray-600",
            initial: contest.site.substring(0, 2).toUpperCase(),
            displayName: contest.site,
          };

          // Parse duration - Kontests returns duration in seconds as string
          const durationSeconds = parseInt(contest.duration) || 0;
          const durationFormatted = formatDuration(durationSeconds);

          return {
            id: `${site}-${index}-${contest.name.substring(0, 10)}`,
            name: contest.name,
            platform: config.displayName,
            platformColor: config.color,
            platformInitial: config.initial,
            startTime: new Date(contest.start_time),
            duration: durationFormatted,
            link: contest.url,
            isSubscribed: subscribedIds.has(`${site}-${index}-${contest.name.substring(0, 10)}`),
          };
        })
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, 50); // Limit to 50 contests

      setContests(transformedContests);
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
      if (newSet.has(contestId)) {
        newSet.delete(contestId);
      } else {
        newSet.add(contestId);
      }
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
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchContests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    contests,
    loading,
    error,
    refetch: fetchContests,
    toggleSubscription,
  };
};
