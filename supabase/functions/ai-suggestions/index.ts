import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get user profile for ratings
    const { data: profile } = await supabase
      .from('profiles')
      .select('rating_codeforces, rating_codechef, rating_leetcode, preferred_platforms')
      .eq('user_id', user.id)
      .maybeSingle();

    // Get upcoming contests
    const { data: contests } = await supabase
      .from('contests')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(50);

    if (!contests || contests.length === 0) {
      return new Response(JSON.stringify({ suggestions: [], message: "No upcoming contests found" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const preferredPlatforms = profile?.preferred_platforms || ['codeforces', 'leetcode', 'codechef', 'atcoder'];
    const cfRating = profile?.rating_codeforces || 0;

    // Simple scoring logic
    const scored = contests.map((contest: any) => {
      let score = 0;

      // Prefer user's platforms
      if (preferredPlatforms.some((p: string) => contest.platform.toLowerCase().includes(p.toLowerCase()))) {
        score += 30;
      }

      // Featured contests get a boost
      if (contest.is_featured) score += 20;

      // Contests happening sooner get priority
      const hoursUntil = (new Date(contest.start_time).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 24) score += 25;
      else if (hoursUntil < 72) score += 15;
      else if (hoursUntil < 168) score += 5;

      // Difficulty matching based on CF rating
      if (contest.difficulty && cfRating > 0) {
        const diffMap: Record<string, number> = { easy: 1200, medium: 1600, hard: 2000 };
        const targetRating = diffMap[contest.difficulty.toLowerCase()] || 1500;
        const diff = Math.abs(cfRating - targetRating);
        if (diff < 400) score += 20;
        else if (diff < 800) score += 10;
      }

      // Shorter contests slightly preferred for practice
      if (contest.duration <= 7200) score += 5;

      return { ...contest, score, reason: getRecommendationReason(contest, score, preferredPlatforms, cfRating) };
    });

    scored.sort((a: any, b: any) => b.score - a.score);

    return new Response(
      JSON.stringify({ suggestions: scored.slice(0, 10) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("AI suggestions error:", msg);
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

function getRecommendationReason(contest: any, score: number, platforms: string[], rating: number): string {
  const reasons: string[] = [];
  if (platforms.some((p: string) => contest.platform.toLowerCase().includes(p.toLowerCase()))) {
    reasons.push("Matches your preferred platform");
  }
  if (contest.is_featured) reasons.push("Featured contest");

  const hoursUntil = (new Date(contest.start_time).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntil < 24) reasons.push("Starting soon");

  if (reasons.length === 0) reasons.push("Recommended for you");
  return reasons.join(" • ");
}
