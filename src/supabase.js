import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://mzwtopynefadhqmdmmjl.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d3RvcHluZWZhZGhxbWRtbWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDgwMjcsImV4cCI6MjA5MjUyNDAyN30.uRLWcZMWLg_GLydshQ9qdUJUiK_TeyWmncGPtdjmJB4";

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export default supabase;