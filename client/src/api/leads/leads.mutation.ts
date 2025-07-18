import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addDescription, addLead, addReminder, deleteDescription, deleteReminder, editDescription, editLead, editReminder } from "./leads.api";
import { toast } from "sonner";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import { useNavigate } from "react-router";
import type { AxiosError } from "axios";

export const useAddLead = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: addLead,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["leads"] }), queryClient.invalidateQueries({ queryKey: ["byDuration"] }));
			navigate("/lead");
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useEditLead = (id: string) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: editLead,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["leadById"] }), navigate(`/lead/${id}`));
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

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
