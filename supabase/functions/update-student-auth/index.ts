// supabase/functions/update-student-auth/index.ts
// Edge Function: Update email dan/atau password Supabase Auth user dari Admin Panel

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, email, password } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Admin client (bypass RLS)
    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const updatePayload: any = {}
    if (email) {
      updatePayload.email = email
      updatePayload.email_confirm = true
    }
    if (password) {
      updatePayload.password = password
    }

    if (Object.keys(updatePayload).length > 0) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, updatePayload)
      if (updateError) throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Auth updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[update-student-auth] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
