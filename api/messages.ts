import { supabase } from "@/utils/supabase";
import { translate } from "@/utils/translate";


export const fetchMessages = async (chatId: string) => {
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
	text: string,
	target: string,
	source: string | 'en'
) => {

	
	const translatedText = await translate(text, source, target);

	const { data, error } = await supabase
		.from("messages")
		.insert([
			{
				chat_id: Number(chatId),
				sender_id: senderId,
				content: text,
				translated_language: target,
				translated_content: translatedText,
			},
		])
		.single(); // Insert a single message and return it

	if (error) throw error;

	return data;
};

export const deleteMessage = async (id: string, senderId: string) => {
	const { error } = await supabase.from("messages").delete().eq("id", id);

	if (error) throw error;
}