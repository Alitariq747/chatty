import {
	View,
	Text,
	Alert,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	ImageBackground,
} from "react-native";
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

const SignUp = () => {
	const router = useRouter();

	// States
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Signup Handler
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
				"Please recheck your credentials and try again."
			);
			throw new Error(error.message);
		}
		setIsLoading(false);
		router.push("/(user)");
	};

	// Login Handler
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
				"Please recheck your credentials and try again."
			);
			throw new Error(error.message);
		}
		setIsLoading(false);
		router.push("/(user)");
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust keyboard offset
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ImageBackground
					source={require("../assets/Default-image.jpg")}
					style={{ flex: 1 }}
					imageStyle={{ resizeMode: "cover" }}
				>
					<View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 14 }}>
						{/* Welcome Text */}
						<Text className="text-4xl font-bold text-center text-purple-950">
							Welcome to Chaty!
						</Text>
						<Text className="text-base font-light text-purple-950 text-center">
							You speak your language, they speak theirs.
						</Text>
						<Text className="text-center text-xl text-purple-950 font-bold">
							Chaty does the rest.
						</Text>

						{/* Email Input */}
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
								keyboardType="email-address"
							/>
						</Input>

						{/* Password Input */}
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
								secureTextEntry
							/>
						</Input>

						{/* Button Group */}
						<ButtonGroup
							className="pt-3"
							isDisabled={isLoading}
						>
							<Button
								className="bg-purple-950"
								size="lg"
								onPress={handleSignUp}
							>
								<ButtonText>Get Started</ButtonText>
								{isLoading && <ButtonSpinner />}
								<ButtonIcon />
							</Button>
							<Button
								size="lg"
								onPress={handleLogin}
								variant="link"
							>
								<ButtonText className="text-purple-950">
									Login Instead
								</ButtonText>
								<ButtonIcon />
							</Button>
						</ButtonGroup>
					</View>
				</ImageBackground>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default SignUp;
