import { ProfileUpdate } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { err } from "react-native-svg";

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

export const updateProfile = async (id: string, updatedFields: ProfileUpdate) => {
    const { data, error } = await supabase.from('profiles').upsert({ ...updatedFields, id }).eq('id', id)
    if (error) {
        throw new Error(error.message)
    }
    return data
}