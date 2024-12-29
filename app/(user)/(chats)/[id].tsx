import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { fetchChatWithFriend } from "@/api/chats";
import { useProfile } from "@/hooks/useProfiles";
import Messages from "@/components/Messages";

const SingleChatScreen = () => {
	const { id } = useLocalSearchParams();

	const user2Id = typeof id === "string" ? id : id[0];

	const { session } = useAuth();

	if (!session || !user2Id) {
		return null;
	}

	const [chat, setChat] = useState<{ id: string } | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getChat = async () => {
			setLoading(true);
			const data = await fetchChatWithFriend(session.user.id, user2Id);
			setChat(data);
			setLoading(false);
		};
		getChat();
	}, []);

	const { data: friendProfile, isLoading: friendLoading } = useProfile(user2Id);

	if (loading) {
		return (
			<ActivityIndicator
				size={40}
				color="purple"
				className="flex-1 justify-center items-center"
			/>
		);
	}

	return (
		<>
			<Stack.Screen options={{ title: friendProfile ? friendProfile.full_name : 'New Chat' }} />
			{chat && <Messages chatId={chat.id} friendId={ user2Id} />}
		</>
	);
};

export default SingleChatScreen;
