import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { addDescription, deleteDescription, editDescription } from "./description.api";
import { toast } from "sonner";

export const useAddDescription = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addDescription,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["leadById"] }), queryClient.invalidateQueries({ queryKey: ["description"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useEditDescription = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editDescription,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["leadById"] }), queryClient.invalidateQueries({ queryKey: ["description"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useDeleteDescription = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteDescription,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["leadById"] }), queryClient.invalidateQueries({ queryKey: ["description"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};
