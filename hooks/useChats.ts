import { getChats } from "@/api/chats"
import { getProfiles } from "@/api/friends"
import { useQuery } from "@tanstack/react-query"

export const useChats = (userId: string) => {
    return useQuery({
        queryKey: ["chats", userId],
        queryFn: async () => {
            const chats = await getChats(userId)

            const friendIds = chats.map((chat) => chat.friendId)

            const profiles = await getProfiles(friendIds)

            return chats.map((chat) => ({
                ...chat,
                friend: profiles.find((profile) => profile.id === chat.friendId)
            }))
        }
    })
 }