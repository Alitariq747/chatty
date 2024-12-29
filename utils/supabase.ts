import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	"https://osumlavjwzjxnsgsnkrj.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zdW1sYXZqd3pqeG5zZ3Nua3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2OTA2MzMsImV4cCI6MjA1MDI2NjYzM30.BiWv3HAARx5Ep6bJViz-v8fImoJwoMjIIMcW4mr0qWQ",
	{
		auth: {
			storage: AsyncStorage as any, // Required for React Native
			autoRefreshToken: true, // Ensures tokens are refreshed
			persistSession: true, // Persists session automatically
			detectSessionInUrl: false, // Not required for mobile
		},
	}
);