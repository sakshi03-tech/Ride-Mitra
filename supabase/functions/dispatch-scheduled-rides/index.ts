// supabase/functions/dispatch-scheduled-rides/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

serve(async () => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Pick rides scheduled within the next 10 minutes
    const tenMinutesAhead = new Date(Date.now() + 10 * 60000).toISOString();
    const { data: scheduledRides } = await supabaseClient
      .from("rides")
      .select("id")
      .eq("status", "searching")
      .not("scheduled_for", "is", null)
      .lte("scheduled_for", tenMinutesAhead);

    if (!scheduledRides || scheduledRides.length === 0) {
      return new Response(JSON.stringify({ dispatched: 0 }), { status: 200 });
    }

    for (const r of scheduledRides) {
      await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/dispatch-ride`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ ride_id: r.id }),
        }
      );
    }

    return new Response(JSON.stringify({ dispatched: scheduledRides.length }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
