import { useMutation } from "@tanstack/react-query";
import { addOrder } from "./orders.api";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useAddOrder = () => {
    const navigate = useNavigate();
	return useMutation({
		mutationFn: addOrder,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
            navigate("/deal")
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};