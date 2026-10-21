// supabase/functions/dispatch-ride/index.ts
// Deno Edge Function for Ride Mitra Dispatch

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { ride_id } = await req.json();
    if (!ride_id) {
      return new Response(JSON.stringify({ error: "Missing ride_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch ride
    const { data: ride, error: rideError } = await supabaseClient
      .from("rides")
      .select("*")
      .eq("id", ride_id)
      .single();

    if (rideError || !ride || ride.status !== "searching") {
      return new Response(JSON.stringify({ message: "Ride not eligible for dispatch" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Find longest-waiting online approved driver who hasn't received this offer yet
    const { data: offers } = await supabaseClient
      .from("ride_offers")
      .select("driver_id")
      .eq("ride_id", ride_id);

    const excludedDrivers = (offers || []).map((o) => o.driver_id);

    const { data: candidateDrivers } = await supabaseClient
      .from("drivers")
      .select("profile_id, last_assigned_at")
      .eq("status", "approved")
      .eq("is_online", true)
      .order("last_assigned_at", { ascending: true, nullsFirst: true })
      .limit(5);

    const chosenDriver = (candidateDrivers || []).find(
      (d) => !excludedDrivers.includes(d.profile_id)
    );

    if (chosenDriver) {
      const expiresAt = new Date(Date.now() + 30000).toISOString();
      await supabaseClient.from("ride_offers").insert({
        ride_id: ride.id,
        driver_id: chosenDriver.profile_id,
        expires_at: expiresAt,
        response: "pending",
      });

      await supabaseClient
        .from("drivers")
        .update({ last_assigned_at: new Date().toISOString() })
        .eq("profile_id", chosenDriver.profile_id);

      // Create notification
      await supabaseClient.from("notifications").insert({
        user_id: chosenDriver.profile_id,
        title: "नवीन रिक्षा विनंती!",
        body: "नवीन भाडे उपलब्ध आहे. ३० सेकंदात स्वीकारा.",
        type: "ride_offer",
        data: { ride_id: ride.id, fare: ride.fare_amount },
      });

      return new Response(
        JSON.stringify({ success: true, offered_to: chosenDriver.profile_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // No driver available
      await supabaseClient
        .from("rides")
        .update({ status: "no_driver_found", updated_at: new Date().toISOString() })
        .eq("id", ride.id);

      return new Response(
        JSON.stringify({ success: false, message: "No driver found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
