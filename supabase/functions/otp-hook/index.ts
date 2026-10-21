// supabase/functions/otp-hook/index.ts
// Supabase Auth Custom SMS Provider Hook for India (MSG91 / Twilio Verify / Mock fallback)

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const { user, sms } = await req.json();
    const phone = user.phone; // e.g. +919822114455
    const otp = sms.otp;

    const provider = Deno.env.get("SMS_PROVIDER") || "mock";
    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    const msg91TemplateId = Deno.env.get("MSG91_TEMPLATE_ID");

    if (provider === "msg91" && msg91AuthKey && msg91TemplateId) {
      // Send real SMS via MSG91 OTP API
      const cleanPhone = phone.replace("+", "");
      const res = await fetch("https://control.msg91.com/api/v5/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authkey: msg91AuthKey,
        },
        body: JSON.stringify({
          template_id: msg91TemplateId,
          mobile: cleanPhone,
          otp: otp,
        }),
      });
      const data = await res.json();
      return new Response(JSON.stringify({ success: true, provider: "msg91", response: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default development fallback / demo logging
    console.log(`[SMS-HOOK] OTP for ${phone} is: ${otp}`);
    return new Response(
      JSON.stringify({
        success: true,
        provider: "mock",
        message: `OTP ${otp} delivered (dev fallback)`,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
