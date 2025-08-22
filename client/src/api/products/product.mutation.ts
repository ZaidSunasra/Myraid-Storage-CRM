import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import type { AxiosError } from "axios";
import { addProduct, editProduct } from "./product.api";

export const useAddProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProduct,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["products"] }));
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};

export const useEditProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editProduct,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["products"] }));
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};