import { useMutation } from "@tanstack/react-query"
import { convertLeadToDeal } from "./deal.api"
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
            navigate("/lead");
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    })
}