import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransformedContest {
  name: string;
  url: string;
  start_time: string;
  duration: string;
  site: string;
  status: string;
}

// ── CLIST API ──────────────────────────────────────────────
async function fetchClistContests(): Promise<TransformedContest[]> {
  const apiKey = Deno.env.get("CLIST_API_KEY");
  if (!apiKey) {
    console.warn("CLIST_API_KEY not set, skipping CLIST fetch");
    return [];
  }

  // CLIST_API_KEY should be in format "username:api_key"
  const [username, key] = apiKey.includes(":") ? apiKey.split(":", 2) : ["", apiKey];
  if (!username || !key) {
    console.error("CLIST_API_KEY must be in 'username:api_key' format");
    return [];
  }

  const resources = [
    "codeforces.com", "leetcode.com", "codechef.com", "atcoder.jp",
    "hackerrank.com", "hackerearth.com", "topcoder.com",
    "kaggle.com", "codesignal.com",
  ];

  const now = new Date().toISOString();
  const params = new URLSearchParams({
    username,
    api_key: key,
    upcoming: "true",
    start__gt: now,
    order_by: "start",
    limit: "150",
    resource__name__in: resources.join(","),
  });

  try {
    const response = await fetch(
      `https://clist.by/api/v4/contest/?${params}`,
      { signal: AbortSignal.timeout(15000) }
    );

    if (!response.ok) {
      console.error("CLIST API error:", response.status, await response.text());
      return [];
    }

    const data = await response.json();
    const contests: TransformedContest[] = (data.objects || []).map(
      (c: { event: string; href: string; start: string; duration: number; resource: { name: string } }) => {
        const host = c.resource?.name || "";
        const site = mapClistResource(host);
        return {
          name: c.event,
          url: c.href,
          start_time: new Date(c.start).toISOString(),
          duration: String(c.duration),
          site,
          status: "BEFORE",
        };
      }
    );

    return contests;
  } catch (error) {
    console.error("Error fetching CLIST:", error);
    return [];
  }
}

function mapClistResource(host: string): string {
  const map: Record<string, string> = {
    "codeforces.com": "CodeForces",
    "leetcode.com": "LeetCode",
    "codechef.com": "CodeChef",
    "atcoder.jp": "AtCoder",
    "hackerrank.com": "HackerRank",
    "hackerearth.com": "HackerEarth",
    "topcoder.com": "TopCoder",
    "kaggle.com": "Kaggle",
    "codesignal.com": "CodeSignal",
  };
  return map[host] || host;
}

// ── Codeforces direct API (fallback) ──────────────────────
async function fetchCodeforcesContests(): Promise<TransformedContest[]> {
  try {
    const response = await fetch("https://codeforces.com/api/contest.list", {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (data.status !== "OK") return [];

    return data.result
      .filter((c: { phase: string }) => c.phase === "BEFORE" || c.phase === "CODING")
      .slice(0, 20)
      .map((c: { id: number; name: string; startTimeSeconds?: number; durationSeconds: number; phase: string }) => ({
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        start_time: c.startTimeSeconds ? new Date(c.startTimeSeconds * 1000).toISOString() : new Date().toISOString(),
        duration: String(c.durationSeconds),
        site: "CodeForces",
        status: c.phase === "CODING" ? "CODING" : "BEFORE",
      }));
  } catch {
    return [];
  }
}

// ── Dedup & merge ─────────────────────────────────────────
function dedup(contests: TransformedContest[]): TransformedContest[] {
  const seen = new Map<string, TransformedContest>();
  for (const c of contests) {
    const key = `${c.name.toLowerCase().trim()}|${c.start_time}`;
    if (!seen.has(key)) seen.set(key, c);
  }
  return Array.from(seen.values());
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching contests from CLIST + fallback APIs...");

    const [clistContests, cfContests] = await Promise.all([
      fetchClistContests(),
      fetchCodeforcesContests(),
    ]);

    // Merge: CLIST first (authoritative), then CF fallback
    const merged = dedup([...clistContests, ...cfContests]);
    merged.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    console.log(`Total unique contests: ${merged.length} (CLIST: ${clistContests.length}, CF fallback: ${cfContests.length})`);

    return new Response(
      JSON.stringify({ contests: merged }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching contests:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
