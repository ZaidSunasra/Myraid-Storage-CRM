import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addDescription } from "./leads.api"
import { toast } from "sonner"
import type { LoginSuccessResponse } from "zs-crm-common"

export const useAddDescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addDescription,
        onSuccess: (data: LoginSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['leadById'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    });

}