import { Database } from "./database.types";

export type Chat = Database['public']['Tables']['chats']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

export type Language = {
    language: string, //code
    name: string
}

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']