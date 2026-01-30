import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://njamhpvjuquwjvgyxpde.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qYW1ocHZqdXF1d2p2Z3l4cGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MjUyNTEsImV4cCI6MjA4NTAwMTI1MX0.cLkeZdCfUArJWxfrnLI_-7SkoxU_eTzFAVy9OUalwEc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
