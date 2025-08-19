import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDeal, approveDrawing, convertLeadToDeal, deleteDrawing, editStatus, getDrawingById, getUploadUrl, rejectDrawing, uploadDrawing } from "./deal.api"
import type { ErrorResponse, SuccessResponse } from "zs-crm-common"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router"

export const useConvertToDeal = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: convertLeadToDeal,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            navigate("/deal");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    })
}

export const useEditStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editStatus,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['deals'] })
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    })
}

export const useAddDeal = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: addDeal,
        onSuccess: (data: SuccessResponse) => {
            (toast.success(data.message));
            queryClient.invalidateQueries({ queryKey: ['deals'] });
            navigate("/deal")
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    })
}

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