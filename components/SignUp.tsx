import { View, Text, Image, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { Input, InputField } from "@/components/ui/input";
import {
	Button,
	ButtonText,
	ButtonSpinner,
	ButtonIcon,
	ButtonGroup,
} from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/providers/AuthProvider";

const SignUp = () => {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isloading, setIsLoading] = useState(false);

	const handleSignUp = async () => {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			setIsLoading(false);
			Alert.alert(
				"Sign Up Failed!",
				"Please recheck your credentials and then try again"
			);
			throw new Error(error.message);
		}
		setIsLoading(false);
		router.push("/(user)");
	};

	const handleLogin = async () => {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) {
			setIsLoading(false);
			Alert.alert(
				"Login Failed!",
				"Please recheck your credentials and then try again"
			);
			throw new Error(error.message);
		}
		setIsLoading(false);
		router.push("/(user)");
	};

	return (
		<View className="flex-1 bg-white">
			{/* Image */}
			<Image
				source={require("../assets/images/intro.jpeg")}
				style={{ width: "100%", height: 450 }}
			/>
			<View className="flex-1 m-4 pt-2 gap-3">
				{/* Welcome Text */}
				<Text className="text-4xl font-bold text-center text-purple-950">
					Welcome to Chaty!
				</Text>
				<Text className="text-base font-light text-purple-950 text-center">
					Now chat with anyone anywhere in the globe with Chaty in your native
					language.
				</Text>
				<Input
					variant="underlined"
					size="md"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter Email here..."
						className="text-purple-950"
						value={email}
						onChangeText={setEmail}
						autoCapitalize="none"
					/>
				</Input>
				<Input
					variant="underlined"
					size="md"
					isDisabled={false}
					isInvalid={false}
					isReadOnly={false}
				>
					<InputField
						placeholder="Enter Password here..."
						className="text-purple-950"
						value={password}
						type="password"
						onChangeText={setPassword}
						autoCapitalize="none"
					/>
				</Input>
				<ButtonGroup
					className="pt-3"
					isDisabled={isloading}
				>
					<Button
						className="bg-purple-950"
						size="lg"
						onPress={handleSignUp}
					>
						<ButtonText>Get Started</ButtonText>
						{isloading && <ButtonSpinner />}
						<ButtonIcon />
					</Button>
					<Button
						size="lg"
						onPress={handleLogin}
						variant="link"
					>
						<ButtonText className="text-purple-950">Login Instead</ButtonText>
						<ButtonIcon />
					</Button>
				</ButtonGroup>
			</View>
		</View>
	);
};

export default SignUp;
