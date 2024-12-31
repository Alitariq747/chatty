import { View, Text, ActivityIndicator, FlatList, Pressable } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useAuth } from "@/providers/AuthProvider";
import { useChats } from "@/hooks/useChats";

const AllMessages = () => {
	const { session } = useAuth();

	const userId = session?.user.id;

	const { data: chats, isLoading, isError } = useChats(userId ?? "");
	
	if (isLoading) {
    return (
			<>

				<ActivityIndicator
					size="large"
          color="purple"
          className="flex-1 justify-center items-center"
				/>
			</>
		);
	}

	if (isError) {
		return (
			<View className="flex-1 justify-center items-center">

				<Text className="text-3xl text-center font-bold text-purple-950">Something went wrong</Text>
			</View>
		);
  }
  
  if (chats?.length === 0) { 
    return (
			<View className="flex-1 justify-center items-center p-5 bg-white gap-3">

				<Text className="text-3xl text-center font-bold text-purple-950">
					No chats found...!
				</Text>
				<Text className="text-lg font-semibold text-purple-950">Click the '+' button at the top to start new chats</Text>
			</View>
		);
  }

	return (
		<View className="flex-1 bg-white px-4 py-3 gap-3">
			<Text className="text-3xl font-bold text-purple-950">Messages</Text>
			<Input className="bg-gray-50 rounded-md border-purple-950 border-2">
				<AntDesign
					name="search1"
					size={20}
					color="purple"
					className="ml-2 mr-0"
				/>
				<InputField placeholder="Search for chats..." />
			</Input>
			<FlatList
				contentContainerStyle={{ flexGrow: 1, gap: 5, paddingHorizontal: 0 }}
				data={chats}
				renderItem={({ item }) => (
					<Link
						href={`/(user)/(chats)/${item.friend.id}`}
						asChild
					>
						<Pressable className="flex-row gap-4 p-3 border-b border-purple-950 mx-0 rounded-md bg-white">
							{/* Add Image from friend.avatar_url */}
							<Text>{item.friend.username.toUpperCase()}</Text>
						</Pressable>
					</Link>
				)}
				keyExtractor={(item) => item.id}
			/>
			
		</View>
	);
};

export default AllMessages;
