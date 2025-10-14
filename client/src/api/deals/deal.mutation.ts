import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDeal, convertLeadToDeal, editDeal, editStatus} from "./deal.api"
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

export const useEditDeal = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: editDeal,
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