import { useProfile, useUpdateProfile } from "@/hooks/useProfiles";
import { useAuth } from "@/providers/AuthProvider";
import { View, Text, ActivityIndicator, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useLanguages } from "@/hooks/useLanguages";
import {
	capitalizeFirstLetter,
	getLanguageCodeByName,
	getLanguageNameByCode,
} from "@/utils/languages";
import { Language, ProfileUpdate } from "@/types/types";
import { supabase } from "@/utils/supabase";

import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";

const ProfilePage = () => {
	const { session } = useAuth();

	const {
		data: profile,
		isLoading,
		isError,
		error,
	} = useProfile(session?.user.id ?? "");

	const {
		data: languages,
		isLoading: languagesLoading,
		isError: langaugesError,
	} = useLanguages();

	const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

	const [image, setImage] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [fullname, setFullname] = useState<string | null>(null);
	const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
		null
	);

	useEffect(() => {
		if (languages && profile?.pref_lang) {
			const languageName = getLanguageNameByCode(profile.pref_lang, languages);
			setSelectedLanguage({ language: profile.pref_lang, name: languageName });
			if (profile) {
				setFullname(profile.full_name);
				setUsername(profile.username);
			}
		}
	}, [languages, profile]);

	const pickImage = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("Permission Denied", "We need access to your gallery!");
			return;
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			const imageUri = result.assets[0].uri; // Save image URI

			setImage(imageUri);
		}
	};

	const uploadImage = async () => {
		if (!image?.startsWith("file://")) {
			return;
		}

		const base64 = await FileSystem.readAsStringAsync(image, {
			encoding: "base64",
		});
		const filePath = `${randomUUID()}.png`;
		const contentType = "image/png";

		const { data, error } = await supabase.storage
			.from("avatars")
			.upload(filePath, decode(base64), { contentType });

		console.log(error);

		if (data) {
			// Generate the public URL
			const { data: publicUrlData } = supabase.storage
				.from("avatars")
				.getPublicUrl(filePath);

			if (publicUrlData) {
				return publicUrlData.publicUrl; // Return the public URL
			}
		}

		return null;
	};

	const handleChange = (text: string) => {
		setSelectedLanguage((prev) => (prev ? { ...prev, name: text } : null));
	};

	const handleProfileUpdate = async (profileData: ProfileUpdate) => {
		const formattedLanguage = capitalizeFirstLetter(selectedLanguage?.name);

		const langCode = languages
			? getLanguageCodeByName(formattedLanguage, languages)
			: null;

		if (langCode === "Unknown") {
			Alert.alert(
				"Update Failed",
				"Please recheck your language spelling and try again"
			);
		}

		const imagePath = await uploadImage();

		await updateProfile(
			{
				id: session?.user.id ?? "",
				updatedFields: {
					full_name: fullname,
					username,
					avatar_url: imagePath,
					pref_lang: langCode ?? undefined,
				},
			},
			{
				onSuccess: () => {
					Alert.alert("Success", "Profile Update Successful");
				},
			}
		);
	};


	if (isLoading || languagesLoading) {
		return (
			<View className="flex-1 bg-white justify-center items-center">
				<Text className="text-center text-2xl text-purple-950 font-bold">
					Fetching Profile
				</Text>
				<ActivityIndicator
					size={"large"}
					color="black"
				/>
			</View>
		);
	}

	if (isError || langaugesError) {
		return (
			<View className="flex-1 bg-white justify-center items-center">
				<Text className="text-center text-2xl text-purple-950 font-bold">
					{error?.message}
				</Text>
			</View>
		);
	}

	return (
		<View className="bg-white p-4 gap-6 flex-1">
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
							profile?.avatar_url
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
						value={username ?? ""}
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
						value={fullname ?? ""}
						onChangeText={setFullname}
						autoCapitalize="none"
						keyboardType="email-address"
					/>
				</Input>
			</View>
			{/* input for preferred language -> take care for first letter capital */}

			<View className="gap-2 px-3">
				<Text className="font-semibold text-lg text-purple-950">
					Preferred Language
				</Text>
				<Input
					variant="outline"
					size="md"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter Language here..."
						className="text-purple-950"
						value={selectedLanguage?.name}
						onChangeText={handleChange}
						autoCapitalize="none"
						keyboardType="default"
					/>
				</Input>
			</View>
			<View className="justify-center items-center gap-4">
				<Text className="text-center text-sm font-light text-stone-800">
					You can now choose from 120 different languages to read your messages
					in..
				</Text>
				<Button
					size="sm"
					variant="solid"
					action="primary"
					className="w-1/3 "
					onPress={handleProfileUpdate}
				>
					<ButtonText>Update Profile</ButtonText>
				</Button>
			</View>
		</View>
	);
};

export default ProfilePage;
