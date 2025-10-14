import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrder, addPayment, deletePayment, editPayment } from "./orders.api";
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

export const useAddPayment = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addPayment,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
			queryClient.invalidateQueries({ queryKey: ['orderById', id] })
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
}

export const useEditPayment = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editPayment,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
			queryClient.invalidateQueries({ queryKey: ['orderById', id] })
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
}

export const useDeletePayment = (id: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePayment,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message));
			queryClient.invalidateQueries({ queryKey: ['orderById', id] })
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
}