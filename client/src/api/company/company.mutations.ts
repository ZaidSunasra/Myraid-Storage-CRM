import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import type { AxiosError } from "axios";
import { addCompanyEmployee, editCompanyDetail, editCompanyEmployee } from "./company.api";

export const useAddClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addCompanyEmployee,
        onSuccess: (data: SuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ["company-employee"] });
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};

export const useEditClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editCompanyEmployee,
        onSuccess: (data: SuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ["company-employee"] });
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};

export const useEditCompany = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editCompanyDetail,
        onSuccess: (data: SuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ["company"] });
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};