import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmployeee, getLeadById, getLeads, getReminders } from "./leads.api"

export const fetchLeads = ({ page, search, employeeIDs, rows, startDate, endDate}: { page: number, search: string, employeeIDs: string[], rows: number, startDate: string, endDate: string}) => {
    return useQuery({
        queryKey: ['leads', page, search, employeeIDs, rows, startDate, endDate],
        queryFn: () => getLeads({ page, search, employeeIDs, rows, startDate, endDate}),
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