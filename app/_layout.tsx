import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useRouter } from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useColorScheme } from "@/components/useColorScheme";
import AuthProvider from "@/providers/AuthProvider";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<GluestackUIProvider mode="light">
			<RootLayoutNav />
		</GluestackUIProvider>
	);
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const router = useRouter();

	return (
		<GluestackUIProvider mode="light">
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
							<Stack screenOptions={{headerShown: false}}>	
								<Stack.Screen
									name="(user)"
									options={{ headerShown: false }}
							/>
							<Stack.Screen name='(auth)' />
							</Stack>
					</QueryClientProvider>
				</AuthProvider>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
