import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { editPermission } from "./permission.api";

export const useEditPermission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editPermission,
        onSuccess: (data: SuccessResponse) => {
            (
                toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ["permissions"] })
            );
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};