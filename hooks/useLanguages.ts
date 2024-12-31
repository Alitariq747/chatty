import { Language } from "@/types/types"
import { getAllLanguages } from "@/utils/languages"
import { useQuery } from "@tanstack/react-query"

export const useLanguages = () => {
    return useQuery<Language[]>({
        queryKey: ['languages'],
        queryFn: async () => {
            const data = await getAllLanguages()
            return data
        }
    })
}