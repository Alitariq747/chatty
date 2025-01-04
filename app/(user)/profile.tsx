import { useProfile, useUpdateProfile } from "@/hooks/useProfiles";
import { useAuth } from "@/providers/AuthProvider";
import {
	View,
	Text,
	ActivityIndicator,
	Image,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
} from "react-native";
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
import { Spinner } from "@/components/ui/spinner";

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

	const {
		mutateAsync: updateProfile,
		isPending,
		isError: mutationError,
	} = useUpdateProfile();

	const [image, setImage] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);
	const [fullname, setFullname] = useState<string | null>(null);
		const [status, setStatus] = useState<string>('');

	const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
		null
	);
	const [isUpadting, setIsUpdating] = useState<boolean>(false);

	useEffect(() => {
		if (languages && profile?.pref_lang) {
			const languageName = getLanguageNameByCode(profile.pref_lang, languages);
			setSelectedLanguage({ language: profile.pref_lang, name: languageName });
			if (profile) {
				setFullname(profile.full_name);
				setUsername(profile.username);
				setStatus(profile.status)
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
		setIsUpdating(true);
		const formattedLanguage = capitalizeFirstLetter(selectedLanguage?.name);

		const langCode = languages
			? getLanguageCodeByName(formattedLanguage, languages)
			: null;

		if (langCode === "Unknown") {
			Alert.alert(
				"Update Failed",
				"Please recheck your language spelling and try again"
			);
			return;
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
					status,
					updated_at: new Date().toISOString(),
				},
			},
			{
				onSuccess: () => {
					Alert.alert("Success", "Profile Update Successful");
					setIsUpdating(false);
				},
				onError: () => {
					setIsUpdating(false);
				},
			}
		);
	};

	if (isLoading || languagesLoading) {
		return (
			<View className="flex-1 bg-white justify-center items-center gap-3">
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

	if (isUpadting) {
		<View className="flex-1 justify-center items-center gap-6 flex-row">
			<Spinner
				size="large"
				color={"gray"}
			/>
			<Text className="text-center text-stone-800">
				Profile Update in progress
			</Text>
		</View>;
	}

	if (isError || langaugesError || mutationError) {
		return (
			<View className="flex-1 bg-white justify-center items-center">
				<Text className="text-center text-2xl text-purple-950 font-bold">
					{error?.message}
				</Text>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="bg-white p-4 gap-6 flex-1">
					<ScrollView
						contentContainerStyle={{
							flexGrow: 1,
							gap: 10,
						}}
					>
						<View className="justify-center items-center rounded-lg gap-3">
							{/* image from avatart url  */}
							{image ? (
								<Image
									source={{ uri: image }}
									style={{
										width: 300,
										height: 300,
										objectFit: "cover",
										borderRadius: 8,
									}}
								/>
							) : (
								<Image
									source={
										profile?.avatar_url
											? { uri: profile.avatar_url }
											: require("../../assets/images/default-user-image.jpg")
									}
									style={{ width: 300, height: 300, objectFit: "contain" }}
									className="rounded-lg"
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
							<Text className="font-semibold text-lg text-purple-950">
								Username:
							</Text>
							<Input
								variant="outline"
								size="md"
								isDisabled={isPending}
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
							<Text className="font-semibold text-lg text-purple-950">
								Fullname:
							</Text>
							<Input
								variant="outline"
								size="md"
								isDisabled={isPending}
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

						<View className="gap-2 px-3">
							<Text className="font-semibold text-lg text-purple-950">
								Status:
							</Text>
							<Input
								variant="outline"
								size="md"
								isDisabled={isPending}
								isInvalid={false}
								isReadOnly={false}
							>
								<InputField
									placeholder="Enter Status here..."
									className="text-purple-950"
									value={status ?? ""}
									onChangeText={setStatus}
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
								isDisabled={isPending}
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
								You can now choose from 120 different languages to read your
								messages in..
							</Text>
							<Button
								size="sm"
								variant="solid"
								action="primary"
								className="w-1/3 "
								onPress={handleProfileUpdate}
								isDisabled={isPending}
							>
								<ButtonText>Update Profile</ButtonText>
							</Button>
						</View>
					</ScrollView>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default ProfilePage;
