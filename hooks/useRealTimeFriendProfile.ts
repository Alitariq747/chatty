import { supabase } from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useRealtimeFriendProfile = (id: string) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const subscription = supabase
			.channel("custom-filter-channel")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "profiles",
					filter: `id=eq.${id}`,
				},
				(payload) => {
					console.log("Change received!", payload);
					queryClient.invalidateQueries({ queryKey: ["profiles", id] });
				}
			)
			.subscribe();
		return () => {
			subscription.unsubscribe();
		};
	}, [queryClient, id]);
};

export default useRealtimeFriendProfile;
