import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markNotification } from "./notification.api";
import type { ErrorResponse, SuccessResponse } from "zs-crm-common";
import type { AxiosError } from "axios";

export const useMarkNotification = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: markNotification,
		onSuccess: (data: SuccessResponse) => {
			(toast.success(data.message), queryClient.invalidateQueries({ queryKey: ["notifications-unread"] }));
			queryClient.invalidateQueries({ queryKey: ["notifications-read"] });
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};
