// supabase/functions/expire-offers/index.ts
// Expires pending ride offers that passed their 30s deadline and rotates to next driver

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

serve(async () => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find expired pending offers
    const { data: expiredOffers } = await supabaseClient
      .from("ride_offers")
      .select("id, ride_id, driver_id")
      .eq("response", "pending")
      .lt("expires_at", new Date().toISOString());

    if (!expiredOffers || expiredOffers.length === 0) {
      return new Response(JSON.stringify({ expired_count: 0 }), { status: 200 });
    }

    for (const offer of expiredOffers) {
      // Mark expired
      await supabaseClient
        .from("ride_offers")
        .update({ response: "expired", responded_at: new Date().toISOString() })
        .eq("id", offer.id);

      // Increment driver strikes
      await supabaseClient.rpc("decline_offer", {
        p_offer_id: offer.id,
        p_reason: "वेळ संपली (Expired 30s)",
      });
    }

    return new Response(JSON.stringify({ success: true, processed: expiredOffers.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
