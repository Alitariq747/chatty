import { supabase } from "@/utils/supabase";

export const getProfiles = async (profileIds: string[]) => { 
    const { data, error } = await supabase.from("profiles").select("*").in("id", profileIds);

    if (error) { throw new Error(error.message) }
    return data;
}