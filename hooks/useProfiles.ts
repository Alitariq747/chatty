import { getAllProfiles, getSingleProfile } from "@/api/profiles";
import { useQuery } from "@tanstack/react-query";

export const useProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const profiles = await getAllProfiles();
            return profiles;
        },
    });
}

export const useProfile = (id: string) => {
	return useQuery({
		queryKey: ["profiles", id],
		queryFn: async () => {
            const profile = await getSingleProfile(id);
            return profile;
		},
	});
};
