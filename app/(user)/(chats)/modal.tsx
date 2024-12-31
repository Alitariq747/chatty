import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	FlatList,
	Text,
	View,
	ActivityIndicator,
	Image,
} from "react-native";

import {
	Button,
	ButtonGroup,
	ButtonIcon,
	ButtonSpinner,
	ButtonText,
} from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/providers/AuthProvider";
import User from "@/components/User";

export default function ModalScreen() {
	const { data: profiles, isLoading, error } = useProfiles();

	const { session } = useAuth();

	const filteredProfiles = profiles
		&& profiles.filter((profile) => profile.id !== session?.user?.id)
		

	// fetch all profiles from supabase.
	// Plus ability to start new chats with any one
	// This also adds them as friends..

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>{error.message}</Text>;
	}

	return (
		<View>
			<StatusBar style="auto" />
			
			<View>
				<FlatList
					contentContainerStyle={{ padding: 10, borderRadius: 10 }}
					data={filteredProfiles}
					renderItem={({ item }) => (
					<User item={item} />
					)}
				/>
			</View>
			
		</View>
	);
}
