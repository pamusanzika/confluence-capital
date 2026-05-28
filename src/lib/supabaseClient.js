import { createClient } from '@supabase/supabase-js'

// Fall back to placeholder strings so createClient never throws at init time.
// Real requests will fail gracefully; components already handle errors with fallbacks.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
