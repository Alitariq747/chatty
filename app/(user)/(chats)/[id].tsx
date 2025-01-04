import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { fetchChatWithFriend } from "@/api/chats";
import { useProfile } from "@/hooks/useProfiles";
import Messages from "@/components/Messages";
import { Chat } from "@/types/types";

const SingleChatScreen = () => {
	const { id } = useLocalSearchParams();

	const user2Id = typeof id === "string" ? id : id[0];

	const { session } = useAuth();

	if (!session || !user2Id) {
		return null;
	}

	const [chat, setChat] = useState<Chat | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getChat = async () => {
			setLoading(true);
			const data = await fetchChatWithFriend(session.user.id, user2Id);
			if (data) {
				setChat(data);
			}
			setLoading(false);
		};
		getChat();
	}, []);

	const { data: friendProfile, isLoading: friendLoading } = useProfile(user2Id);

	const targetLanguage = friendProfile?.pref_lang;


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
			<Stack.Screen options={{ title: friendProfile?.full_name ?? 'New Chat' }} />
			{chat && <Messages chatId={chat.id.toString()} friendId={user2Id} friendLang={targetLanguage ?? 'en'} />}
		</>
	);
};

export default SingleChatScreen;
