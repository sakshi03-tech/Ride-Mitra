// supabase/functions/sos-notify/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sos_id, ride_id, lat, lng, student_phone } = await req.json();

    // Query all admins
    const { data: admins } = await supabaseClient
      .from("profiles")
      .select("id, phone")
      .eq("role", "admin");

    const message = `🚨 आणीबाणी SOS अलर्ट: Ride ID: ${ride_id}, प्रवासी फोन: ${student_phone}, Location: https://maps.google.com/?q=${lat},${lng}`;

    for (const admin of admins || []) {
      await supabaseClient.from("notifications").insert({
        user_id: admin.id,
        title: "🚨 आणीबाणी SOS अलर्ट!",
        body: message,
        type: "sos_emergency",
        data: { sos_id, ride_id, lat, lng },
      });
    }

    return new Response(JSON.stringify({ success: true, notified_admins: (admins || []).length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
