import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Profile } from '@/types/types'

type UserProps = {
	item: Profile
}

const User = ({ item }: UserProps) => {

    const router = useRouter()
    
    const handleChat = () => {
        console.log("Chat with", item.full_name)
        router.replace(`/(user)/(chats)/${item.id}`)
    }

    return (
			<Pressable onPress={handleChat}>
				<View className="flex-row gap-4 p-3 border-b border-gray-300 mx-3 rounded-md bg-white">
					{/* Image Avatar */}

					{item.avatar_url ? (
						<Image
							source={{ uri: item.avatar_url }}
							style={{ width: 40, height: 40 }}
							className="rounded-3xl"
						/>
					) : (
						<Image
							source={require("../assets/images/default-user-image.jpg")}
							style={{ width: 40, height: 40 }}
							className="rounded-3xl"
						/>
					)}

					<View>
						<Text className="text-base font-semibold text-purple-950">
							{item.full_name}
						</Text>
						<Text className="text-sm font-normal text-purple-950">
							{item.status}
						</Text>
					</View>
				</View>
			</Pressable>
		);
}

export default User