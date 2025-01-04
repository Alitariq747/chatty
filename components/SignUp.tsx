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
	const [otp, setOtp] = useState("");
	const [isSigningUp, setIsSigningUp] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	// Signup Handler
	const handleSendOtp = async () => {
		setIsSigningUp(true);
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			
		});

		if (error) {
			setIsSigningUp(false);
			console.log(error);

			Alert.alert(
				"Registration Failed!",
				"Please recheck your email and try again."
			);
			return;
		}
		if (error == null && data.session == null && data.user == null) {
			setIsSigningUp(false);

			Alert.alert(
				"Confirmation Required",
				"Enter received otp below to log in"
			);
		}
	};

	// Login Handler
	const handleVerifyOtp = async () => {
		setIsLoggingIn(true);
		const {
			data: { session },
			error,
		} = await supabase.auth.verifyOtp({
			email,
			token: otp,
			type: "email",
		});

		if (error) {
			setIsLoggingIn(false);
			Alert.alert("Login Failed!", "Please recheck your otp and try again.");
			return;
		}
		if (session) {
			setIsLoggingIn(false);
			router.push("/(user)");			
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ImageBackground
					source={require("../assets/Default-image.jpg")}
					style={{ flex: 1 }}
					imageStyle={{ resizeMode: "cover" }}
				>
					<View
						style={{ flex: 1, padding: 16, justifyContent: "center", gap: 14 }}
					>
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
							size="lg"
							isDisabled={isLoggingIn || isSigningUp}
							isInvalid={false}
							isReadOnly={false}
						>
							<InputField
								placeholder="Enter Email here..."
								className="text-purple-950"
								value={email}
								onChangeText={setEmail}
								autoCapitalize="none"
								keyboardType="default"
							/>
						</Input>

						{/* Password Input */}
						<Input
							variant="underlined"
							size="lg"
							isDisabled={isLoggingIn || isSigningUp}
							isInvalid={false}
							isReadOnly={false}
						>
							<InputField
								placeholder="Enter Otp here..."
								className="text-purple-950"
								value={otp}
								type="password"
								onChangeText={setOtp}
								autoCapitalize="none"
							/>
						</Input>

						{/* Button Group */}
						<ButtonGroup
							className="pt-3"
							isDisabled={isSigningUp || isLoggingIn}
						>
							<Button
								className="bg-purple-950"
								size="lg"
								onPress={handleSendOtp}
							>
								<ButtonText>Get Otp</ButtonText>
								{isSigningUp && <ButtonSpinner />}
								<ButtonIcon />
							</Button>
							<Button
								size="lg"
								onPress={handleVerifyOtp}
								variant="link"
							>
								<ButtonText className="text-purple-950">Verify </ButtonText>
								{isLoggingIn && <ButtonSpinner />}

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
