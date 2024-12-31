import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	Pressable,
	Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Button, ButtonText } from "./ui/button";
import {
	useDeleteMessage,
	useFetchMessages,
	useSendMessage,
} from "@/hooks/useMessages";
import { useAuth } from "@/providers/AuthProvider";
import useRealtimeMessages from "@/hooks/useRealTimeMessages";
import { useProfile } from "@/hooks/useProfiles";

type MessagesProps = {
	chatId: string;
	friendId: string;
	friendLang: string;
};

const Messages = ({ chatId, friendLang }: MessagesProps) => {
	const flatListRef = useRef<FlatList>(null);

	useRealtimeMessages(chatId);

	const { data: messages = [], isLoading, isError } = useFetchMessages(chatId);

	useEffect(() => {
		flatListRef.current?.scrollToEnd({ animated: true });
	}, [messages]);

	const { session } = useAuth();

	const { data: profile } = useProfile(session?.user.id ?? "");

	const [message, setMessage] = useState(""); // State for input field

	const { mutate: sendMessage, isPending: sendingMessage } = useSendMessage();

	const { mutate: deleteMessage, isPending: deletingMessage } =
		useDeleteMessage();

	if (isLoading) {
		return (
			<ActivityIndicator
				size="large"
				color="#6B46C1"
				className="flex-1 justify-center items-center"
			/>
		);
	}

	if (isError) {
		return <Text>Error fetching messages</Text>;
	}

	const handleSendMessage = () => {
		if (message.trim() === "" || !session) return;

		sendMessage({
			chatId,
			senderId: session.user.id,
			text: message,
			target: friendLang,
			source: profile?.pref_lang,
		});
		setMessage("");
	};

	const handleDelete = (id: string, senderId: string) => {
		if (senderId !== session?.user.id) {
			Alert.alert("Delete Message", "You can only delete your own messages");
			return;
		}
		Alert.alert(
			"Delete Message",
			"Are you sure you want to delete this message?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						if (session?.user.id) {
							deleteMessage({ id, senderId: session.user.id });
						}
					},
				},
			]
		);
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={{ flex: 1 }}>
					{/* FlatList for displaying messages */}
					<FlatList
						ref={flatListRef} // Attach reference
						data={messages}
						keyExtractor={(item) => item.id}
						contentContainerStyle={{ padding: 16 }}
						renderItem={({ item }) => (
							<Pressable
								onPress={() => handleDelete(item.id, item.sender_id)}
								style={{
									backgroundColor:
										item.sender_id === session?.user.id ? "#eee6ee" : "#260a69",
									padding: 10,
									borderRadius: 8,
									marginVertical: 5,
									alignSelf:
										item.sender_id === session?.user.id
											? "flex-end"
											: "flex-start",
								}}
							>
								<Text
									style={{
										color:
											item.sender_id === session?.user.id ? "purple" : "white",
									}}
								>
									{item.sender_id === session?.user.id
										? item.content
										: item.translated_content}
								</Text>
							</Pressable>
						)}
						onContentSizeChange={() =>
							flatListRef.current?.scrollToEnd({ animated: true })
						}
					/>

					{/* Input and Send Button */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							padding: 10,
							borderTopWidth: 1,
							borderColor: "#ddd",
							backgroundColor: "white",
							gap: 5,
						}}
					>
						<TextInput
							style={{
								flex: 1,
								borderWidth: 1,
								borderColor: "#6B46C1",
								borderRadius: 20,
								paddingHorizontal: 10,
								paddingVertical: 8,
								fontSize: 16,
								backgroundColor: "#F7FAFC",
								maxHeight: 120,
							}}
							multiline={true}
							placeholder="Enter Message here..."
							value={message}
							onChangeText={setMessage}
							onSubmitEditing={handleSendMessage}
						/>
						<Button
							size="md"
							variant="solid"
							action="positive"
							onPress={handleSendMessage}
							className="bg-purple-950 rounded-3xl"
						>
							<ButtonText>Send</ButtonText>
						</Button>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default Messages;
