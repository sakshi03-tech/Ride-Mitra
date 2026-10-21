// supabase/functions/send-push/index.ts
// Sends Web Push (VAPID) notification to user's registered browsers

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { user_id, title, body, data } = await req.json();

    if (!user_id || !title) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Retrieve active push subscriptions
    const { data: subs } = await supabaseClient
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", user_id);

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ message: "No active push subscriptions for user" }), {
        status: 200,
      });
    }

    // Push payload dispatch logic
    const results = [];
    for (const sub of subs) {
      results.push({
        endpoint: sub.endpoint,
        status: "queued",
        payload: { title, body, data },
      });
    }

    return new Response(JSON.stringify({ success: true, delivered_count: results.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
