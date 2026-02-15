import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NormalizedContest {
  name: string;
  url: string;
  start_time: string;
  duration: number;
  platform: string;
  external_id: string;
}

// ── Codeforces ──────────────────────────────────────────
async function fetchCodeforces(): Promise<NormalizedContest[]> {
  try {
    const res = await fetch("https://codeforces.com/api/contest.list", {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) { console.error("CF API error:", res.status); return []; }
    const data = await res.json();
    if (data.status !== "OK") return [];

    return data.result
      .filter((c: any) => c.phase === "BEFORE" || c.phase === "CODING")
      .slice(0, 20)
      .map((c: any) => ({
        name: c.name,
        url: `https://codeforces.com/contest/${c.id}`,
        start_time: c.startTimeSeconds
          ? new Date(c.startTimeSeconds * 1000).toISOString()
          : new Date().toISOString(),
        duration: c.durationSeconds,
        platform: "CodeForces",
        external_id: `cf-${c.id}`,
      }));
  } catch (e) { console.error("CF fetch error:", e); return []; }
}

// ── AtCoder ─────────────────────────────────────────────
async function fetchAtCoder(): Promise<NormalizedContest[]> {
  try {
    const res = await fetch("https://kenkoooo.com/atcoder/resources/contests.json", {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const contests = await res.json();
    const now = Math.floor(Date.now() / 1000);

    return contests
      .filter((c: any) => c.start_epoch_second > now)
      .slice(0, 10)
      .map((c: any) => ({
        name: c.title,
        url: `https://atcoder.jp/contests/${c.id}`,
        start_time: new Date(c.start_epoch_second * 1000).toISOString(),
        duration: c.duration_second,
        platform: "AtCoder",
        external_id: `ac-${c.id}`,
      }));
  } catch (e) { console.error("AtCoder fetch error:", e); return []; }
}

// ── LeetCode (GraphQL with fallback) ────────────────────
async function fetchLeetCode(): Promise<NormalizedContest[]> {
  try {
    const res = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        query: `{ allContests { title titleSlug startTime duration } }`,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const now = Math.floor(Date.now() / 1000);
      const contests = data?.data?.allContests || [];

      const upcoming = contests
        .filter((c: any) => c.startTime > now)
        .slice(0, 8)
        .map((c: any) => ({
          name: c.title,
          url: `https://leetcode.com/contest/${c.titleSlug}`,
          start_time: new Date(c.startTime * 1000).toISOString(),
          duration: c.duration,
          platform: "LeetCode",
          external_id: `lc-${c.titleSlug}`,
        }));

      if (upcoming.length > 0) return upcoming;
    }
  } catch (e) {
    console.warn("LeetCode GraphQL failed, using fallback:", e);
  }

  return generateLeetCodeFallback();
}

function generateLeetCodeFallback(): NormalizedContest[] {
  const contests: NormalizedContest[] = [];
  const now = new Date();

  for (let i = 0; i < 4; i++) {
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7) + (i * 7));
    nextSunday.setUTCHours(10, 30, 0, 0);
    if (nextSunday > now) {
      const weekNum = Math.floor((nextSunday.getTime() - new Date('2023-01-01').getTime()) / (7 * 86400000)) + 330;
      contests.push({
        name: `Weekly Contest ${weekNum}`,
        url: `https://leetcode.com/contest/weekly-contest-${weekNum}`,
        start_time: nextSunday.toISOString(),
        duration: 5400,
        platform: "LeetCode",
        external_id: `lc-weekly-contest-${weekNum}`,
      });
    }
  }
  return contests;
}

// ── CodeChef ────────────────────────────────────────────
async function fetchCodeChef(): Promise<NormalizedContest[]> {
  try {
    const res = await fetch(
      "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
      { signal: AbortSignal.timeout(10000) }
    );

    if (res.ok) {
      const data = await res.json();
      const upcoming = [
        ...(data.future_contests || []),
        ...(data.present_contests || []),
      ];

      if (upcoming.length > 0) {
        return upcoming.slice(0, 10).map((c: any) => ({
          name: c.contest_name,
          url: `https://www.codechef.com/${c.contest_code}`,
          start_time: new Date(c.contest_start_date_iso || c.contest_start_date).toISOString(),
          duration: (c.contest_duration || 120) * 60,
          platform: "CodeChef",
          external_id: `cc-${c.contest_code}`,
        }));
      }
    }
  } catch (e) {
    console.warn("CodeChef API failed, using fallback:", e);
  }

  return generateCodeChefFallback();
}

function generateCodeChefFallback(): NormalizedContest[] {
  const contests: NormalizedContest[] = [];
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const nextWed = new Date(now);
    const daysUntilWed = (3 - now.getDay() + 7) % 7 || 7;
    nextWed.setDate(now.getDate() + daysUntilWed + (i * 7));
    nextWed.setUTCHours(14, 30, 0, 0);
    if (nextWed > now) {
      const num = 170 + i;
      contests.push({
        name: `Starters ${num}`,
        url: "https://www.codechef.com/contests",
        start_time: nextWed.toISOString(),
        duration: 7200,
        platform: "CodeChef",
        external_id: `cc-starters-${num}`,
      });
    }
  }
  return contests;
}

// ── CLIST API (for additional platforms) ────────────────
async function fetchClistPlatforms(): Promise<NormalizedContest[]> {
  const apiKey = Deno.env.get("CLIST_API_KEY");
  if (!apiKey) return [];

  const [username, key] = apiKey.includes(":") ? apiKey.split(":", 2) : ["", apiKey];
  if (!username || !key) return [];

  // Only fetch platforms not covered by direct APIs
  const resources = [
    "hackerrank.com", "hackerearth.com", "topcoder.com",
    "kaggle.com", "codesignal.com", "codingninjas.com",
    "geeksforgeeks.org", "interviewbit.com",
  ];

  const resourceMap: Record<string, string> = {
    "hackerrank.com": "HackerRank",
    "hackerearth.com": "HackerEarth",
    "topcoder.com": "TopCoder",
    "kaggle.com": "Kaggle",
    "codesignal.com": "CodeSignal",
    "codingninjas.com": "CodeStudio",
    "geeksforgeeks.org": "GeeksforGeeks",
    "interviewbit.com": "InterviewBit",
  };

  const now = new Date().toISOString();
  const params = new URLSearchParams({
    username,
    api_key: key,
    upcoming: "true",
    start__gt: now,
    order_by: "start",
    limit: "100",
    resource__name__in: resources.join(","),
  });

  try {
    const res = await fetch(`https://clist.by/api/v4/contest/?${params}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) { console.error("CLIST API error:", res.status); return []; }
    const data = await res.json();

    return (data.objects || []).map((c: any) => {
      const host = c.resource?.name || "";
      const platform = resourceMap[host] || host;
      return {
        name: c.event,
        url: c.href,
        start_time: new Date(c.start).toISOString(),
        duration: c.duration,
        platform,
        external_id: `clist-${c.id}`,
      };
    });
  } catch (e) { console.error("CLIST fetch error:", e); return []; }
}

// ── Auto-subscribe users with platform auto-reminders ───
async function autoSubscribeUsers(supabase: any, contests: NormalizedContest[]) {
  if (contests.length === 0) return;

  // Get all users with auto_reminder_platforms set
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, auto_reminder_platforms, reminder_offsets, notification_channels")
    .not("auto_reminder_platforms", "eq", "{}");

  if (!profiles || profiles.length === 0) return;

  const platformMap: Record<string, string> = {
    "CodeForces": "codeforces",
    "LeetCode": "leetcode",
    "CodeChef": "codechef",
    "AtCoder": "atcoder",
    "HackerEarth": "hackerearth",
    "HackerRank": "hackerrank",
    "Kaggle": "kaggle",
    "TopCoder": "topcoder",
    "CodeSignal": "codesignal",
    "CodeStudio": "codestudio",
    "GeeksforGeeks": "geeksforgeeks",
    "InterviewBit": "interviewbit",
  };

  // Get contest IDs from DB
  const contestExternalIds = contests.map(c => c.external_id);
  const { data: dbContests } = await supabase
    .from("contests")
    .select("id, platform, external_id")
    .in("external_id", contestExternalIds);

  if (!dbContests || dbContests.length === 0) return;

  const subscriptions: any[] = [];
  const reminders: any[] = [];

  for (const profile of profiles) {
    const autoPlatforms: string[] = profile.auto_reminder_platforms || [];
    const offsets: number[] = profile.reminder_offsets || [30, 60];
    const channels: Record<string, boolean> = profile.notification_channels || { browser: true };
    const activeChannels = Object.entries(channels).filter(([_, v]) => v).map(([k]) => k);
    if (activeChannels.length === 0) activeChannels.push("browser");

    for (const contest of dbContests) {
      const platformKey = platformMap[contest.platform];
      if (!platformKey || !autoPlatforms.includes(platformKey)) continue;

      subscriptions.push({
        user_id: profile.user_id,
        contest_id: contest.id,
      });

      // Find the original contest data for start_time
      const originalContest = contests.find(c => c.external_id === contest.external_id);
      if (!originalContest) continue;

      for (const offset of offsets) {
        for (const channel of activeChannels) {
          const reminderTime = new Date(new Date(originalContest.start_time).getTime() - offset * 60 * 1000);
          if (reminderTime > new Date()) {
            reminders.push({
              user_id: profile.user_id,
              contest_id: contest.id,
              reminder_time: reminderTime.toISOString(),
              channel,
              status: "pending",
            });
          }
        }
      }
    }
  }

  // Upsert subscriptions (ignore duplicates)
  if (subscriptions.length > 0) {
    const { error } = await supabase
      .from("contest_subscriptions")
      .upsert(subscriptions, { onConflict: "user_id,contest_id", ignoreDuplicates: true });
    if (error) console.error("Auto-subscribe upsert error:", error);
    else console.log(`✅ Auto-subscribed ${subscriptions.length} user-contest pairs`);
  }

  if (reminders.length > 0) {
    const { error } = await supabase.from("reminders").insert(reminders);
    if (error && !error.message?.includes("duplicate")) {
      console.error("Auto-reminder insert error:", error);
    }
  }
}

// ── Main Handler ────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Log sync start
  const { data: logEntry } = await supabase
    .from("sync_logs")
    .insert({ sync_type: "full", status: "running" })
    .select("id")
    .single();

  const logId = logEntry?.id;
  let totalSynced = 0;
  const errors: string[] = [];

  try {
    console.log("🔄 Starting contest sync...");

    // Fetch all platforms in parallel
    const results = await Promise.allSettled([
      fetchWithRetry(fetchCodeforces, "CodeForces"),
      fetchWithRetry(fetchAtCoder, "AtCoder"),
      fetchWithRetry(fetchLeetCode, "LeetCode"),
      fetchWithRetry(fetchCodeChef, "CodeChef"),
      fetchWithRetry(fetchClistPlatforms, "CLIST"),
    ]);

    const allContests: NormalizedContest[] = [];
    const platformNames = ["CodeForces", "AtCoder", "LeetCode", "CodeChef", "CLIST"];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        console.log(`✅ ${platformNames[i]}: ${result.value.length} contests`);
        allContests.push(...result.value);
      } else {
        const errMsg = `${platformNames[i]}: ${result.reason}`;
        console.error(`❌ ${errMsg}`);
        errors.push(errMsg);
      }
    });

    // Upsert into DB (dedup by platform + external_id)
    if (allContests.length > 0) {
      const { error: upsertError } = await supabase
        .from("contests")
        .upsert(
          allContests.map(c => ({
            name: c.name,
            url: c.url,
            start_time: c.start_time,
            duration: c.duration,
            platform: c.platform,
            external_id: c.external_id,
          })),
          { onConflict: "platform,external_id", ignoreDuplicates: false }
        );

      if (upsertError) {
        console.error("Upsert error:", upsertError);
        errors.push(`Upsert: ${upsertError.message}`);
      }
      totalSynced = allContests.length;

      // Auto-subscribe users who have platform auto-reminders enabled
      await autoSubscribeUsers(supabase, allContests);
    }

    // Clean up old contests (past by more than 24h)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from("contests")
      .delete()
      .lt("start_time", yesterday);

    console.log(`🏁 Sync complete: ${totalSynced} contests synced, ${errors.length} errors`);

    // Update log
    if (logId) {
      await supabase.from("sync_logs").update({
        contests_synced: totalSynced,
        error_message: errors.length > 0 ? errors.join("; ") : null,
        completed_at: new Date().toISOString(),
        status: errors.length > 0 ? "partial" : "success",
      }).eq("id", logId);
    }

    return new Response(
      JSON.stringify({ synced: totalSynced, errors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync failed:", msg);

    if (logId) {
      await supabase.from("sync_logs").update({
        error_message: msg,
        completed_at: new Date().toISOString(),
        status: "failed",
      }).eq("id", logId);
    }

    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Retry wrapper
async function fetchWithRetry(
  fn: () => Promise<NormalizedContest[]>,
  label: string,
  retries = 3
): Promise<NormalizedContest[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      console.warn(`${label} attempt ${attempt}/${retries} failed:`, e);
      if (attempt === retries) throw e;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return [];
}
