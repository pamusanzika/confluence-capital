import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidHttpUrl(value) {
	if (!value || typeof value !== 'string') return false
	try {
		const parsed = new URL(value)
		return parsed.protocol === 'http:' || parsed.protocol === 'https:'
	} catch {
		return false
	}
}

const looksLikePlaceholder =
	!supabaseUrl ||
	!supabaseAnonKey ||
	supabaseUrl.includes('your-supabase-project-url') ||
	supabaseAnonKey.includes('your-supabase-anon-key')

if (looksLikePlaceholder || !isValidHttpUrl(supabaseUrl)) {
	throw new Error(
		'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local with real values from your Supabase project.'
	)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
