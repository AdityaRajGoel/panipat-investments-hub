const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes

function getRateLimitKey(req: Request): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

function sanitize(val: unknown, maxLen = 500): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen).replace(/[<>"'&]/g, (c) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
    return map[c] || c;
  });
}

function isValidPhone(phone: string): boolean {
  // Indian phone: 10 digits, optionally prefixed with +91 or 91
  return /^(\+?91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''));
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const ip = getRateLimitKey(req);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Too many submissions. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const name = sanitize(body.name, 100);
    const phone = sanitize(body.phone, 20);
    const email = body.email ? sanitize(body.email, 255) : null;
    const city = body.city ? sanitize(body.city, 100) : null;
    const message = body.message ? sanitize(body.message, 1000) : null;

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid name is required (min 2 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!phone || !isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid Indian phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (email && !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Save to database using service role (bypasses RLS)
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
      body: JSON.stringify({ name, phone, email, city, message }),
    });

    if (!dbRes.ok) {
      console.error('DB insert failed:', await dbRes.text());
    }

    // WhatsApp notification (sanitized values used in URL encoding)
    const whatsappNumber = '919416400314';
    const waMessage = `🆕 New Lead!\n👤 ${name}\n📱 ${phone}${email ? `\n📧 ${email}` : ''}${city ? `\n📍 ${city}` : ''}${message ? `\n💬 ${message}` : ''}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    return new Response(
      JSON.stringify({
        success: true,
        whatsappUrl,
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
