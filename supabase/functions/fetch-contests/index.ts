import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Fetching contests from Kontests API...");
    
    // Fetch from Kontests API (server-side, no CORS issues)
    const response = await fetch("https://kontests.net/api/v1/all");
    
    if (!response.ok) {
      throw new Error(`Kontests API returned ${response.status}`);
    }

    const contests: KontestsContest[] = await response.json();
    console.log(`Fetched ${contests.length} contests`);

    // Filter to only upcoming contests
    const now = new Date();
    const upcomingContests = contests.filter((contest) => {
      const startTime = new Date(contest.start_time);
      return startTime > now || contest.status === "CODING";
    });

    console.log(`Filtered to ${upcomingContests.length} upcoming contests`);

    return new Response(
      JSON.stringify({ contests: upcomingContests }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching contests:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
