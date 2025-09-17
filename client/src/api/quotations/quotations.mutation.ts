import { useMutation } from "@tanstack/react-query";
import { addQuotation, getQuotationProducts } from "./quotations.api";
import type { AxiosError } from "axios";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { toast } from "sonner";
import { useQuotation } from "@/context/QuotationContext"
import { useNavigate } from "react-router";

export const useFetchQuotationProduct = (bay: number, compartment: number) => {
    const { addProduct } = useQuotation();
    return useMutation({
        mutationFn: getQuotationProducts,
        onSuccess: (data: any) => {
            addProduct(data.products, `${bay} Bay ${compartment} Compartment`)
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
            navigate("/deal")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};