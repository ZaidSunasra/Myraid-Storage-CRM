import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmployeee, getLeadByDuration, getLeadById, getLeads, getProducts, getReminderByMonth, getReminders, getSources } from "./leads.api"

export const fetchLeads = ({ page, search, employeeIDs, rows, startDate, endDate, selectedSources }: { page: number, search: string, employeeIDs: string[], rows: number, startDate: string, endDate: string, selectedSources: string[] }) => {
    return useQuery({
        queryKey: ['leads', page, search, employeeIDs, rows, startDate, endDate, selectedSources],
        queryFn: () => getLeads({ page, search, employeeIDs, rows, startDate, endDate, selectedSources }),
        placeholderData: keepPreviousData
    })
}

export const fetchEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: getEmployeee
    })
}

export const fetchLeadById = (id: string) => {
    return useQuery({
        queryKey: ['leadById', id],
        queryFn: () => getLeadById(id)
    })
}

export const fetchReminders = (id: string) => {
    return useQuery({
        queryKey: ['reminders', id],
        queryFn: () => getReminders(id)
    })
}

export const fetchProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts
    })
}

export const fetchSources = () => {
    return useQuery({
        queryKey: ['sources'],
        queryFn: getSources
    })
}

export const fetchLeadByDuration = (duration: "today" | "weekly" | "monthly" | "yearly" | "all") => {
    return useQuery({
        queryKey: ['byDuration', duration],
        queryFn: () => getLeadByDuration(duration)
    })
}

export const fetchReminderByMonth = (month: string) => {
    return useQuery({
        queryKey: ['reminderByMonth', month],
        queryFn: () => getReminderByMonth(month)
    })
}