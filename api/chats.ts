import { supabase } from "@/utils/supabase";

export const getChats = async (userId: string) => {
	const { data, error } = await supabase
		.from("chats")
		.select("*")
		.or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

	if (error) {
		throw new Error(error.message);
	}
    return data.map((chat) => ({
        ...chat,
        friendId: chat.user1_id === userId ? chat.user2_id : chat.user1_id,
        createdAt: chat.created_at,
    }) );
};

export const fetchChatWithFriend = async (userId: string, friendId: string) => {
	const { data, error } = await supabase
		.from("chats")
		.select("*")
		.or(
			`and(user1_id.eq.${userId},user2_id.eq.${friendId}),and(user1_id.eq.${friendId},user2_id.eq.${userId})`
		)
		.single();
	if (error) {
		 if (error.code === "PGRST116") {
			 // "PGRST116" indicates no rows found. Return null explicitly.
			 const newChat = await createChat(userId, friendId);
			 return newChat;
			}
		throw new Error(error.message);
	};

	return data;
};

export const createChat = async (userId: string, friendId: string) => {
	const { data, error } = await supabase.from("chats").insert([
		{ user1_id: userId, user2_id: friendId },
	]);
	if (error) throw error;

	return data;
}