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

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log("⏰ Checking for pending reminders...");

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Find pending reminders that are due (reminder_time <= now + 5 min)
    const { data: dueReminders, error: fetchError } = await supabase
      .from("reminders")
      .select(`
        id,
        user_id,
        contest_id,
        reminder_time,
        channel,
        status,
        contests (name, platform, url, start_time),
        profiles:user_id (phone_number, notification_channels, full_name)
      `)
      .eq("status", "pending")
      .lte("reminder_time", fiveMinutesFromNow.toISOString())
      .order("reminder_time", { ascending: true });

    if (fetchError) {
      console.error("Error fetching reminders:", fetchError);
      throw fetchError;
    }

    if (!dueReminders || dueReminders.length === 0) {
      console.log("✅ No pending reminders due");
      return new Response(
        JSON.stringify({ sent: 0, message: "No reminders due" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📬 Found ${dueReminders.length} reminders to process`);

    let sent = 0;
    let failed = 0;

    for (const reminder of dueReminders) {
      try {
        const contest = reminder.contests as any;
        const profile = reminder.profiles as any;

        if (!contest) {
          console.warn(`Reminder ${reminder.id}: contest not found, marking failed`);
          await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
          failed++;
          continue;
        }

        const contestStartTime = new Date(contest.start_time);
        const minutesUntil = Math.round((contestStartTime.getTime() - now.getTime()) / 60000);
        const timeUntilStr = minutesUntil > 60
          ? `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`
          : `${minutesUntil} minutes`;

        // Send WhatsApp if channel is whatsapp and user has phone number
        if (reminder.channel === "whatsapp" && profile?.phone_number) {
          try {
            const whatsappRes = await fetch(`${supabaseUrl}/functions/v1/send-whatsapp`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${serviceRoleKey}`,
              },
              body: JSON.stringify({
                to: profile.phone_number,
                contestName: contest.name,
                platform: contest.platform,
                timeUntil: `Starts in ${timeUntilStr}`,
              }),
            });

            const whatsappResult = await whatsappRes.json();
            if (!whatsappRes.ok) {
              console.error(`WhatsApp send failed for reminder ${reminder.id}:`, whatsappResult);
            }
          } catch (e) {
            console.error(`WhatsApp error for reminder ${reminder.id}:`, e);
          }
        }

        // Mark reminder as sent (browser push handled client-side)
        await supabase
          .from("reminders")
          .update({ status: "sent" })
          .eq("id", reminder.id);

        sent++;
        console.log(`✅ Reminder sent: ${contest.name} → ${reminder.channel}`);
      } catch (e) {
        console.error(`Failed to process reminder ${reminder.id}:`, e);
        await supabase.from("reminders").update({ status: "failed" }).eq("id", reminder.id);
        failed++;
      }
    }

    console.log(`🏁 Reminders processed: ${sent} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ sent, failed, total: dueReminders.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Send reminders failed:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
