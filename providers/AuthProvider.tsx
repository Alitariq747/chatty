import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

type AuthType = {
	session: Session | null;
	loading: boolean;
	profile: any;
};

const AuthContext = createContext<AuthType>({
	session: null,
	loading: false,
	profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();

			if (error) {
				setLoading(false);

				throw new Error(error.message);
			}

			setSession(data.session);

			if (session) {
				const { data } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", session.user.id);
				setProfile(data);
			}
			setLoading(false);
		};
		getSession();
		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<AuthContext.Provider value={{ session, loading, profile }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
