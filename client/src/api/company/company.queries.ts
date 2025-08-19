import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompanyEmployee } from "./comapny.api";

export const FetchCompanies = (name: string) => {
	return useQuery({ 
        queryKey: ["company", name], 
        queryFn: () => getCompanies(name) 
    });
};

export const FetchCompanyEmployee = (id: number) => {
	return useQuery({ 
        queryKey: ["company-employee", id], 
        queryFn: () => getCompanyEmployee(id),
        enabled: !!id 
    });
};