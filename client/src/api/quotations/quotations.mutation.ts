import { useMutation } from "@tanstack/react-query";
import { addQuotation, copyQuotation, deleteQuotation, editQuotation, getQuotationProducts } from "./quotations.api";
import type { AxiosError } from "axios";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { toast } from "sonner";
import { useQuotation } from "@/context/QuotationContext"
import { useNavigate } from "react-router";

export const useFetchQuotationProduct = (name: string) => {
    const { addProduct } = useQuotation();
    return useMutation({
        mutationFn: getQuotationProducts,
        onSuccess: (data) => {
            addProduct(data.products, name)
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            toast.error(error.response?.data.message);
        }
    });
};

export const useAddQuotation = () => {
    const { clearAll } = useQuotation();
    const navigate = useNavigate();
	return useMutation({
		mutationFn: addQuotation,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
            clearAll();
            navigate("/quotation")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};


export const useEditQuotation = () => {
    const { clearAll } = useQuotation();
    const navigate = useNavigate();
	return useMutation({
		mutationFn: editQuotation,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
            clearAll();
            navigate("/quotation")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useCopyQuotation = () => {
    const navigate = useNavigate();
	return useMutation({
		mutationFn: copyQuotation,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
            navigate("/quotation")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useDeleteQuotation = () => {
    const navigate = useNavigate();
	return useMutation({
		mutationFn: deleteQuotation,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
            navigate("/quotation")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};