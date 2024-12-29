import React from 'react'
import { Link, router, Stack } from 'expo-router'
import { Pressable, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const ChatsLayout = () => {
  	const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name='index' options={{
        headerRight: () => (
                    <Link
                      href="/(user)/(chats)/modal"
                      asChild
                    >
                      <Pressable>
                        {({ pressed }) => (
                          <FontAwesome
                            name="plus"
                            size={25}
                            color={Colors[colorScheme ?? "light"].text}
                            style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                          />
                        )}
                      </Pressable>
                    </Link>
        ),
        title: "Chats",
      }}/>
  
			<Stack.Screen
				name="modal"
				options={{
					presentation: "modal",
					title: "New chat",
					headerRight: () => (
						<Pressable
							onPress={() => {
								router.back();
							}}
						>
							<View>
								<FontAwesome
									name="close"
									size={20}
									color="black"
								/>
							</View>
						</Pressable>
					),
				}}
      />
		</Stack>
	);
}

export default ChatsLayout