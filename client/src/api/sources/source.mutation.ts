import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import type { AxiosError } from "axios";
import { addSource, editSource } from "./source.api";

export const useAddSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addSource,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["sources"] }));
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};

export const useEditSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editSource,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["sources"] }));
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};