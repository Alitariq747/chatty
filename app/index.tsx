import { ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import SignUp from "@/components/SignUp";

const OnboardingScreen = () => {

    const {session, loading} = useAuth()


	if (loading) {
		return (
			<>
				<ActivityIndicator
					className="flex-1 justify-center items-center"
					size={"large"}
				/>
			</>
		);
		
	
	}

	if (!session) {
		return <Redirect href="/(auth)" />;
	}

	if (session) {
		return (
			<Redirect href="/(user)" />
		);
	}
};

export default OnboardingScreen;
