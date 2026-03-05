import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// In-memory rate limiting (per edge function instance)
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil: number }>()

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000 // 5 minute window

function getRateLimitKey(req: Request): string {
  return req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record) return { allowed: true }

  // Check if locked out
  if (record.lockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000) }
  }

  // Reset if window expired
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS
    return { allowed: false, retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) }
  }

  return { allowed: true }
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (record) {
    record.count += 1
    record.lastAttempt = now
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now, lockedUntil: 0 })
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip)
}

// Input sanitization
function sanitizeString(val: unknown, maxLength = 500): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, maxLength)
}

function sanitizeBoolean(val: unknown): boolean {
  return val === true
}

function sanitizeNumber(val: unknown): number {
  const num = Number(val)
  return Number.isFinite(num) ? num : 0
}

// Allowed file types for upload
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

function safeErrorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const contentType = req.headers.get('content-type') || ''
    const clientIp = getRateLimitKey(req)

    // Handle image upload (multipart form data)
    if (contentType.includes('multipart/form-data')) {
      const rateCheck = checkRateLimit(clientIp)
      if (!rateCheck.allowed) {
        return safeErrorResponse(429, `Too many attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.`)
      }

      const formData = await req.formData()
      const password = formData.get('password') as string
      const file = formData.get('file') as File
      const shareId = formData.get('share_id') as string

      const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
      if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
        recordFailedAttempt(clientIp)
        return safeErrorResponse(401, 'Invalid password')
      }
      clearAttempts(clientIp)

      if (!file) {
        return safeErrorResponse(400, 'No file provided')
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return safeErrorResponse(400, 'Invalid file type. Allowed: PNG, JPG, WebP, SVG, GIF')
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return safeErrorResponse(400, 'File too large. Maximum size is 2MB.')
      }

      const ext = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'png'
      const safeShareId = shareId ? shareId.replace(/[^a-zA-Z0-9-]/g, '') : crypto.randomUUID()
      const fileName = `${safeShareId}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('stock-logos')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return safeErrorResponse(500, 'Failed to upload file')
      }

      const { data: urlData } = supabase.storage
        .from('stock-logos')
        .getPublicUrl(fileName)

      if (shareId) {
        await supabase
          .from('unlisted_shares')
          .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
          .eq('id', safeShareId)
      }

      return new Response(JSON.stringify({ success: true, url: urlData.publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // JSON body requests
    const body = await req.json()
    const action = sanitizeString(body.action, 20)
    const password = typeof body.password === 'string' ? body.password : ''
    const data = body.data || {}

    // Public action - no password needed
    if (action === 'list') {
      const { data: shares, error } = await supabase
        .from('unlisted_shares')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) {
        console.error('List error:', error)
        return safeErrorResponse(500, 'Failed to load shares')
      }
      return new Response(JSON.stringify({ success: true, data: shares }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Rate limit check for all authenticated actions
    const rateCheck = checkRateLimit(clientIp)
    if (!rateCheck.allowed) {
      return safeErrorResponse(429, `Too many attempts. Try again in ${rateCheck.retryAfterSeconds} seconds.`)
    }

    // Verify password action
    if (action === 'verify') {
      const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
      if (!ADMIN_PASSWORD) {
        return safeErrorResponse(500, 'Server configuration error')
      }
      if (password !== ADMIN_PASSWORD) {
        recordFailedAttempt(clientIp)
        return safeErrorResponse(401, 'Invalid password')
      }
      clearAttempts(clientIp)
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // All other actions require password
    const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
    if (!ADMIN_PASSWORD) {
      return safeErrorResponse(500, 'Server configuration error')
    }
    if (password !== ADMIN_PASSWORD) {
      recordFailedAttempt(clientIp)
      return safeErrorResponse(401, 'Invalid password')
    }
    clearAttempts(clientIp)

    if (action === 'update') {
      if (!data.id || typeof data.id !== 'string') {
        return safeErrorResponse(400, 'Invalid share ID')
      }

      const updateData: Record<string, any> = {
        name: sanitizeString(data.name, 200),
        short_code: sanitizeString(data.short_code, 20),
        tag: sanitizeString(data.tag, 50),
        tag_color: sanitizeString(data.tag_color, 100),
        price: sanitizeString(data.price, 50),
        min_qty: sanitizeString(data.min_qty, 50),
        gradient_color: sanitizeString(data.gradient_color, 100),
        display_order: sanitizeNumber(data.display_order),
        is_active: sanitizeBoolean(data.is_active),
        updated_at: new Date().toISOString(),
      }
      if (data.image_url !== undefined) {
        updateData.image_url = data.image_url === null ? null : sanitizeString(data.image_url, 1000)
      }

      const { error } = await supabase
        .from('unlisted_shares')
        .update(updateData)
        .eq('id', data.id)

      if (error) {
        console.error('Update error:', error)
        return safeErrorResponse(500, 'Failed to update share')
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'create') {
      const name = sanitizeString(data.name, 200)
      const short_code = sanitizeString(data.short_code, 20)
      const price = sanitizeString(data.price, 50)

      if (!name || !short_code || !price) {
        return safeErrorResponse(400, 'Name, short code, and price are required')
      }

      const { error } = await supabase
        .from('unlisted_shares')
        .insert({
          name,
          short_code,
          tag: sanitizeString(data.tag, 50) || 'Popular',
          tag_color: sanitizeString(data.tag_color, 100) || 'bg-secondary/10 text-secondary',
          price,
          min_qty: sanitizeString(data.min_qty, 50) || '1 Share',
          gradient_color: sanitizeString(data.gradient_color, 100) || 'from-blue-600 to-blue-800',
          display_order: sanitizeNumber(data.display_order),
          image_url: data.image_url ? sanitizeString(data.image_url, 1000) : null,
        })

      if (error) {
        console.error('Create error:', error)
        return safeErrorResponse(500, 'Failed to create share')
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'delete') {
      if (!data.id || typeof data.id !== 'string') {
        return safeErrorResponse(400, 'Invalid share ID')
      }

      const { error } = await supabase
        .from('unlisted_shares')
        .delete()
        .eq('id', data.id)

      if (error) {
        console.error('Delete error:', error)
        return safeErrorResponse(500, 'Failed to delete share')
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return safeErrorResponse(400, 'Invalid action')

  } catch (error) {
    console.error('Unhandled error:', error)
    return safeErrorResponse(500, 'An unexpected error occurred')
  }
})
