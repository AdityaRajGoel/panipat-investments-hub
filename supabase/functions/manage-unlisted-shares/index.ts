import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Handle image upload (multipart form data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const password = formData.get('password') as string
      const file = formData.get('file') as File
      const shareId = formData.get('share_id') as string

      const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
      if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (!file) {
        return new Response(JSON.stringify({ success: false, error: 'No file provided' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const ext = file.name.split('.').pop() || 'png'
      const fileName = `${shareId || crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('stock-logos')
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type 
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('stock-logos')
        .getPublicUrl(fileName)

      // Update the share's image_url if shareId provided
      if (shareId) {
        await supabase
          .from('unlisted_shares')
          .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
          .eq('id', shareId)
      }

      return new Response(JSON.stringify({ success: true, url: urlData.publicUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // JSON body requests
    const { action, password, data } = await req.json()

    if (action === 'list') {
      const { data: shares, error } = await supabase
        .from('unlisted_shares')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      return new Response(JSON.stringify({ success: true, data: shares }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')
    if (!ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ success: false, error: 'Admin password not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'update') {
      const updateData: Record<string, any> = {
        name: data.name,
        short_code: data.short_code,
        tag: data.tag,
        tag_color: data.tag_color,
        price: data.price,
        min_qty: data.min_qty,
        gradient_color: data.gradient_color,
        display_order: data.display_order,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      }
      if (data.image_url !== undefined) {
        updateData.image_url = data.image_url
      }

      const { error } = await supabase
        .from('unlisted_shares')
        .update(updateData)
        .eq('id', data.id)

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'create') {
      const { error } = await supabase
        .from('unlisted_shares')
        .insert({
          name: data.name,
          short_code: data.short_code,
          tag: data.tag,
          tag_color: data.tag_color,
          price: data.price,
          min_qty: data.min_qty,
          gradient_color: data.gradient_color,
          display_order: data.display_order,
          image_url: data.image_url || null,
        })

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('unlisted_shares')
        .delete()
        .eq('id', data.id)

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
