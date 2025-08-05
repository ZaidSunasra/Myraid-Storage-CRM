import { useQueryClient, useMutation } from "@tanstack/react-query";
import {  addLead, editLead } from "./leads.api";
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
