import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ErrorResponse, type LoginSuccessResponse, type SuccessResponse } from "zs-crm-common";
import { changePassword, editUser, login, logout, resetPassword, signup } from "./auth.api";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { type AxiosError } from "axios";
import { navItems } from "@/utils/getNavigationLink";

export const useLogin = () => {
	const { setUser } = useUser();
	const navigate = useNavigate();
	return useMutation({
		mutationFn: login,
		onSuccess: (data: LoginSuccessResponse) => {
			setUser({ name: data.userData.name, email: data.userData.email, department: data.userData.department, code: data.userData.code as string, id: data.userData.id });
			toast.success(data.message);
			navigate(navItems[data.userData.department][0].url);
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useSignup = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signup,
		onSuccess: (data: SuccessResponse) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: ["all-employee", "user-detail"] })
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};


export const useEditUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editUser,
		onSuccess: (data: SuccessResponse) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: ["all-employee"] })
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

export const useChangePassword = () => {
	return useMutation({
		mutationFn: changePassword,
		onSuccess: (data: SuccessResponse) => {
			toast.success(data.message);
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};

export const useResetPassword = () => {
	return useMutation({
		mutationFn: resetPassword,
		onSuccess: (data: SuccessResponse) => {
			toast.success(data.message);
		},
		onError: (error: AxiosError<ErrorResponse>) => {
			toast.error(error.response?.data.message);
		}
	});
};