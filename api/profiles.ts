import { supabase } from "@/utils/supabase";

export const getAllProfiles = async () => {

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) { throw new Error(error.message) }

    return data;
}

export const getSingleProfile = async (id: string) => {

    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).select().single();

    if (error) { throw new Error(error.message) }

    return data;
}