import { useQuery } from "@tanstack/react-query"
import { getUserDetail } from "./auth.api"

export const FetchUserDetail = () => {
    return useQuery({
        queryKey: ['user-detail'],
        queryFn: getUserDetail
    })
}