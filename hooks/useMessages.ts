import { deleteMessage, fetchMessages, sendMessage } from "@/api/messages";
import { useAuth } from "@/providers/AuthProvider";
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
			target,
			source
		}: {
			chatId: string;
			senderId: string;
				text: string;
				target: string;
			source: string
		}) => sendMessage(chatId, senderId, text, target, source),

		onSuccess: (data, variables) => {
			// Update cache after sending a message
            queryClient.invalidateQueries({queryKey:  ["messages", variables.chatId]});
		},
	});
};

export const useDeleteMessage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, senderId }: { id: string; senderId: string }) => deleteMessage(id, senderId),

		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["messages", variables.senderId] });
		},
	});
}