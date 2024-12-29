import { ActivityIndicator } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import SignUp from "@/components/SignUp";

const OnboardingScreen = () => {

    const {session, loading, profile} = useAuth()


	if (loading) {
		return <ActivityIndicator className="flex-1 justify-center" size={34}/>;
	}

	if (session) {
		return <Redirect href={"/(user)"} />;
	}


		return (
			<>
				<SignUp />
			</>
		);

};

export default OnboardingScreen;
