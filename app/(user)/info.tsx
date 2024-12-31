import { View, Text } from 'react-native'
import React from 'react'
import { ButtonGroup, ButtonIcon, ButtonText, Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

const InfoPage = () => {

  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/(auth)')
  }

  return (
		<View className="flex-1 bg-white py-8 px-4 gap-4">
			<Text className="font-bold text-stone-800 text-center text-2xl">
				Important Things To Note About Chatty
			</Text>
			<Text className="text-center font-normal text-stone-800">
				Its a realtime chat application that enables users to chat in their
				native language.
			</Text>
			<Text className="text-center font-normal text-stone-800">
				You just have to go to profiles tab and enter your preferred language
				and chatty automatically translates even your incoming texts in your
				preferred language.
			</Text>
			<Text className="text-center font-normal text-stone-800">
				Since its a new application; things might seem a bit slow but we are
				working on improvements..
			</Text>
			<ButtonGroup>
				<Button onPress={handleLogout}>
					<ButtonText>Logout</ButtonText>
					<ButtonIcon />
				</Button>
			</ButtonGroup>
		</View>
	);
}

export default InfoPage