import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmployeee, getLeadById, getLeads, getReminders } from "./leads.api"

export const fetchLeads = ({ page, search, employeeIDs, rows }: { page: number, search: string, employeeIDs: string[], rows: number }) => {
    return useQuery({
        queryKey: ['leads', page, search, employeeIDs, rows],
        queryFn: () => getLeads({ page, search, employeeIDs, rows }),
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