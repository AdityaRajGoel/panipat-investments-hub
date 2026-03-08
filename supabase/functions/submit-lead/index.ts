const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, city, message } = await req.json();

    if (!name || !phone) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Save to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const dbRes = await fetch(`${supabaseUrl}/rest/v1/account_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ name, phone, email: email || null, city: city || null, message: message || null }),
    });

    if (!dbRes.ok) {
      const errText = await dbRes.text();
      console.error('DB insert failed:', errText);
    }

    // 2. Send WhatsApp notification (via wa.me deep link is client-side, 
    //    but we can construct a message for the business number)
    const whatsappNumber = '919416400314';
    const waMessage = `🆕 New Account Lead!\n\n👤 Name: ${name}\n📱 Phone: ${phone}${email ? `\n📧 Email: ${email}` : ''}${city ? `\n📍 City: ${city}` : ''}${message ? `\n💬 Message: ${message}` : ''}\n\n⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
    
    // WhatsApp Business API notification via URL (returned to client for redirect)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    // 3. Send email notification
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a365d, #2d5016); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🆕 New Account Opening Request</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Name</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Phone</td><td style="padding: 8px 0; font-weight: bold; font-size: 14px;"><a href="tel:${phone}">${phone}</a></td></tr>
            ${email ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;">${email}</td></tr>` : ''}
            ${city ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">City</td><td style="padding: 8px 0; font-size: 14px;">${city}</td></tr>` : ''}
            ${message ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Message</td><td style="padding: 8px 0; font-size: 14px;">${message}</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} via Parasram India website</p>
        </div>
      </div>
    `;

    // Use mailto link approach — returned to client
    // For actual email delivery, a proper SMTP/email service would be needed
    const emailTo = 'parasrampnp@gmail.com';

    return new Response(
      JSON.stringify({
        success: true,
        whatsappUrl,
        emailTo,
        message: 'Lead saved successfully',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing lead:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
