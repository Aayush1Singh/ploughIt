import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://givytcuxosjbfyhxhygj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpdnl0Y3V4b3NqYmZ5aHhoeWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3OTEyMjgsImV4cCI6MjA1MTM2NzIyOH0.nVUhSgJDu_eO55VZzKZ7qSHkrVcoXpNarGMp5sOCL7Q";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
