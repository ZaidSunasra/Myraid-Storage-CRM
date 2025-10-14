import { useMutation, useQueryClient } from "@tanstack/react-query"
import { approveDrawing, deleteDrawing, getDrawingById, getUploadUrl, rejectDrawing, showDrawingInOrder, uploadDrawing } from "./upload.api"
import type { ErrorResponse, SuccessResponse } from "zs-crm-common"
import { toast } from "sonner"
import type { AxiosError } from "axios"

export const useUploadUrl = () => {
    return useMutation({
        mutationFn: getUploadUrl,
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
};

export const useUploadDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadDrawing,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['drawings'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    })
}

export const useViewDrawing = () => {
    return useMutation({
        mutationFn: getDrawingById,
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
}

export const useDeleteDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDrawing,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['drawings'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
}

export const useApproveDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveDrawing,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['drawings'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
}

export const useRejectDrawing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectDrawing,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['drawings'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
}

export const useShowDrawingInOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: showDrawingInOrder,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['drawings'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        },
    });
}