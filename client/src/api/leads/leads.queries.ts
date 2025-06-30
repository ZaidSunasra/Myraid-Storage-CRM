import { useQuery, keepPreviousData} from "@tanstack/react-query"
import { getEmployeee, getLeads } from "./leads.api"

export const fetchLeads = ({page, search, employeeIDs}: {page: number, search: string, employeeIDs: string[]}) => {
    return useQuery({
        queryKey: ['leads', page, search, employeeIDs],
        queryFn: () => getLeads({page, search, employeeIDs}),
        placeholderData: keepPreviousData
    })
}

export const fetchEmployees = () => {
    return useQuery({
        queryKey: ['employees'],
        queryFn: getEmployeee
    })
}