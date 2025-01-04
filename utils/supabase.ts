import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

export const supabase = createClient<Database>(
	process.env.SUPABASE_URL || "",
	process.env.SUPABASE_PUBLIC_KEY || "",
	{
		auth: {
			storage: AsyncStorage as any, // Required for React Native
			autoRefreshToken: true, // Ensures tokens are refreshed
			persistSession: true, // Persists session automatically
			detectSessionInUrl: false, // Not required for mobile
		},
	}
);