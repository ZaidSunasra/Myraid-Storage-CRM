import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addDescription, addLead, addReminder, deleteReminder, editLead } from "./leads.api"
import { toast } from "sonner"
import type { LeadSuccessResponse, LoginSuccessResponse } from "zs-crm-common"
import { useNavigate } from "react-router"

export const useAddDescription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addDescription,
        onSuccess: (data: LoginSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['leadById'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    });
}

export const useAddReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addReminder,
        onSuccess: (data: LoginSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['reminders'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    })
}

export const useAddLead = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: addLead,
        onSuccess: (data: LeadSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['leads'] }),
                navigate("/lead")
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    })
}

export const useEditLead = (id: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: editLead,
        onSuccess: (data: LeadSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['leadById'] }),
                navigate(`/lead/${id}`)
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    })
}

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReminder,
        onSuccess: (data: LeadSuccessResponse) => {
            toast.success(data.message),
                queryClient.invalidateQueries({ queryKey: ['reminders'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message)
        },
    })
}