import { useMutation } from "@tanstack/react-query"
import {type LoginSuccessResponse} from "zs-crm-common"
import { login } from "./auth.api"
import { useUser } from "@/context/UserContext"
import {toast} from "sonner"
import { useNavigate } from "react-router"

export const useLogin = () => {

    const { setUser } = useUser();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: (data: LoginSuccessResponse) => {
            setUser({
                name: data.userData.name,
                email: data.userData.email,
                department: data.userData.department,
                code: data.userData.code || ""
            });
            toast.success(data.message);
            navigate("/lead")
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        }
    })
}