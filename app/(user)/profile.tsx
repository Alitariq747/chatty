import { useProfile } from '@/hooks/useProfiles'
import { useAuth } from '@/providers/AuthProvider'
import { View, Text, ActivityIndicator, Image, Alert } from 'react-native'
import * as ImagePicker from "expo-image-picker";
import { useState } from 'react';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { useLanguages } from '@/hooks/useLanguages';


const ProfilePage = () => {
    const { session } = useAuth();

const {
	data: profile,
	isLoading,
	isError,
	error,
} = useProfile(session?.user.id ?? "");

  
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState(profile?.username)
    const [fullname, setFullname] = useState(profile?.full_name);



  const { data: langauges, isLoading: languagesLoading, isError: langaugesError} = useLanguages()

  

const pickImage = async () => {
	const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
	if (status !== "granted") {
		Alert.alert("Permission Denied", "We need access to your gallery!");
		return;
	}

	 let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

	if (!result.canceled) {
		setImage(result.assets[0].uri); // Save image URI
	}
};
  
  if (isLoading) {
    return (
      <View className='flex-1 bg-white justify-center items-center'>
        <Text className='text-center text-2xl text-purple-950 font-bold'>Fetching Profile</Text>
        <ActivityIndicator size={'large'} color='black'/>
      </View>
    )
  }

  if (isError) {
    return (
      <View className='flex-1 bg-white justify-center items-center'>
        <Text className='text-center text-2xl text-purple-950 font-bold'>{ error.message }</Text>
      </View>
    )
  }

  return (
		<View className="bg-white p-4 gap-6">
			<View className="justify-center items-center rounded-lg gap-3">
				{/* image from avatart url  */}
				{image ? (
					<Image
						source={{ uri: image }}
						style={{ width: 300, height: 300, objectFit: "contain" }}
					/>
				) : (
					<Image
						source={
							profile.avatar_url
								? { uri: profile.avatar_url }
								: require("../../assets/images/default-user-image.jpg")
						}
						style={{ width: 300, height: 300, objectFit: "contain" }}
					/>
				)}
				<Button
					size="sm"
					variant="solid"
					action="primary"
					className="w-1/3 "
					onPress={pickImage}
				>
					<ButtonText>Edit photo</ButtonText>
				</Button>
			</View>

			<View className="gap-2 px-3">
				<Text className="font-semibold text-lg text-purple-950">Username:</Text>
				<Input
					variant="outline"
					size="md"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter Username here..."
						className="text-purple-950"
						value={username}
						onChangeText={setUsername}
						autoCapitalize="none"
						keyboardType="email-address"
					/>
				</Input>
			</View>

			<View className="gap-2 px-3">
				<Text className="font-semibold text-lg text-purple-950">Fullname:</Text>
				<Input
					variant="outline"
					size="md"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter Fullname here..."
						className="text-purple-950"
						value={fullname}
						onChangeText={setFullname}
						autoCapitalize="none"
						keyboardType="email-address"
					/>
				</Input>
			</View>
			{/* input for preferred language -> take care for first letter capital */}
		</View>
	);
}

export default ProfilePage