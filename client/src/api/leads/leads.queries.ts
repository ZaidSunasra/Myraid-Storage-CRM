import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getDescription, getLeadByDuration, getLeadById, getLeads, getReminderByMonth, getReminders } from "./leads.api"

export const FetchLeads = ({ page, search, employeeIDs, rows, startDate, endDate, selectedSources }: { page: number, search: string, employeeIDs: string[], rows: number, startDate: string, endDate: string, selectedSources: string[] }) => {
    return useQuery({
        queryKey: ['leads', page, search, employeeIDs, rows, startDate, endDate, selectedSources],
        queryFn: () => getLeads({ page, search, employeeIDs, rows, startDate, endDate, selectedSources }),
        placeholderData: keepPreviousData
    })
}

export const FetchLeadById = (id: string) => {
    return useQuery({
        queryKey: ['leadById', id],
        queryFn: () => getLeadById(id)
    })
}

export const FetchLeadByDuration = (duration: "today" | "weekly" | "monthly" | "yearly" | "all") => {
    return useQuery({
        queryKey: ['byDuration', duration],
        queryFn: () => getLeadByDuration(duration)
    })
}

export const FetchDescription = (id: string) => {
    return useQuery({
        queryKey: ['description', id],
        queryFn: () => getDescription(id)
    })
}

export const FetchReminders = (id: string) => {
    return useQuery({
        queryKey: ['reminders', id],
        queryFn: () => getReminders(id)
    })
}

export const FetchReminderByMonth = (month: string) => {
    return useQuery({
        queryKey: ['reminderByMonth', month],
        queryFn: () => getReminderByMonth(month)
    })
}
