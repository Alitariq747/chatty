import { supabase } from "@/utils/supabase";


export const fetchMessages = async (chatId: string, pageParam: number = 0) => {
	const { data, error } = await supabase
		.from("messages")
		.select("*")
		.eq("chat_id", chatId) // Fetch messages for the given chat ID
		.order("created_at", { ascending: true }) // Order by time (oldest first)
		

	if (error) throw error;

	return data;
};

export const sendMessage = async (
	chatId: string,
	senderId: string,
	text: string
) => {
	const { data, error } = await supabase
		.from("messages")
		.insert([
			{
				chat_id: chatId,
				sender_id: senderId,
				content: text,
			},
		])
		.single(); // Insert a single message and return it

	if (error) throw error;

	return data;
};
