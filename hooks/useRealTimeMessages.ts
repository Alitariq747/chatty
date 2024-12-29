import { useEffect } from "react";
import { supabase } from "@/utils/supabase"; // Replace with your Supabase client path
import { useQueryClient } from "@tanstack/react-query";

const useRealtimeMessages = (chatId: string) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Subscribe to Realtime changes in the messages table
		const channel = supabase
			.channel(`messages:chat:${chatId}`) // Unique channel name
			.on(
				"postgres_changes",
				{
					event: "*", // Listen to insert, update, delete
					schema: "public",
					table: "messages",
					filter: `chat_id=eq.${chatId}`, // Filter by chat ID
				},
				(payload) => {
                    queryClient.invalidateQueries({ queryKey: ["messages", chatId]}); // Refetch messages
				}
			)
			.subscribe();

		// Cleanup subscription on unmount
		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId, queryClient]);
};

export default useRealtimeMessages;
