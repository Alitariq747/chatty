import { getAllProfiles, getSingleProfile, updateProfile } from "@/api/profiles";
import { ProfileUpdate } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
export const useProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const profiles = await getAllProfiles();
            return profiles;
        },
    })
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

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updatedFields }: { id: string, updatedFields: ProfileUpdate }) => updateProfile(id, updatedFields),
         onSuccess: async (_, id) => queryClient.invalidateQueries({queryKey: ['profiles', id]})
    })
}