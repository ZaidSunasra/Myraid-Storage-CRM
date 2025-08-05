import { useQuery } from "@tanstack/react-query";
import { getAllEmployee, getAssignedEmployee, getSalesEmployee } from "./employee.api";

export const FetchSalesEmployee = () => {
	return useQuery({ queryKey: ["sales-employee"], queryFn: getSalesEmployee });
};

export const FetchAllEmployee = () => {
	return useQuery({ queryKey: ["all-employee"], queryFn: getAllEmployee });
};

export const FetchAssignedEmployee = (id: string, type: "lead" | "deal") => {
	return useQuery({ queryKey: ["assigned-employee", id], queryFn: () => getAssignedEmployee(id, type) });
};
