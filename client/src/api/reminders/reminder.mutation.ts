import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addReminder, deleteReminder, editReminder } from "./reminders.api";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import type { AxiosError } from "axios";

export const useAddReminder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addReminder,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["reminders"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useEditReminder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editReminder,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["reminders"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useDeleteReminder = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteReminder,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["reminders"] }));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};
