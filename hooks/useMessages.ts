import { fetchMessages, sendMessage } from "@/api/messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchMessages = (chatId: string) => {
	return useQuery({
		queryKey: ["messages", chatId],
		queryFn: () => fetchMessages(chatId),
		
	});
};


export const useSendMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			chatId,
			senderId,
			text,
		}: {
			chatId: string;
			senderId: string;
			text: string;
		}) => sendMessage(chatId, senderId, text),

		onSuccess: (data, variables) => {
			// Update cache after sending a message
            queryClient.invalidateQueries({queryKey:  ["messages", variables.chatId]});
		},
	});
};
