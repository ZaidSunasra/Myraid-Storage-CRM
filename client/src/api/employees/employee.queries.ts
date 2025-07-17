import { useQuery } from "@tanstack/react-query"
import { getAllEmployee, getSalesEmployee } from "./employee.api"

export const FetchSalesEmployee = () => {
    return useQuery({
        queryKey: ['sales-employee'],
        queryFn: getSalesEmployee
    })
}

export const FetchAllEmployee = () => {
    return useQuery({
        queryKey: ['all-employee'],
        queryFn: getAllEmployee
    })
}
