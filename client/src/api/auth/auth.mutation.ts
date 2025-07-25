import { useMutation } from "@tanstack/react-query";
import { type ErrorResponse, type LoginSuccessResponse, type SuccessResponse } from "zs-crm-common";
import { login, logout } from "./auth.api";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { type AxiosError } from "axios";

export const useLogin = () => {
	const { setUser } = useUser();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: login,
		onSuccess: (data: LoginSuccessResponse) => {
			setUser({ name: data.userData.name, email: data.userData.email, department: data.userData.department, code: data.userData.code || "", id: data.userData.id });
			toast.success(data.message);
			navigate("/lead");
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useLogout = () => {
	const { clearUser } = useUser();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: logout,
		onSuccess: (data: SuccessResponse) => {
			clearUser();
			toast.success(data.message);
			navigate("/");
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};
