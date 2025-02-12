import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Your Supabase project URL and public anon key
const SUPABASE_URL = "https://clbbrslvoutrlgyzhnay.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsYmJyc2x2b3V0cmxneXpobmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxNzg1NzgsImV4cCI6MjA1Mzc1NDU3OH0.iC71K4sapX6tva9wcyanR2nDXq7LM8DIYPySNl62D08";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // In React Native, disable URL detection since we're handling deep links manually
    detectSessionInUrl: false,
    // Store and refresh tokens automatically
    autoRefreshToken: true,
    persistSession: false,
    // Use AsyncStorage to store session in RN
    storage: AsyncStorage,
  },
});
