import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getLeadByDuration, getLeadById, getLeads } from "./leads.api";

export const FetchLeads = ({ page, search, employeeIDs, rows, startDate, endDate, sources }: { page: number; search: string; employeeIDs: string[]; rows: number; startDate: string; endDate: string; sources: string[] }) => {
	return useQuery({ queryKey: ["leads", page, search, employeeIDs, rows, startDate, endDate, sources], queryFn: () => getLeads({ page, search, employeeIDs, rows, startDate, endDate, sources }), placeholderData: keepPreviousData });
};

export const FetchLeadById = (id: string) => {
	return useQuery({ queryKey: ["leadById", id], queryFn: () => getLeadById(id) });
};

export const FetchLeadByDuration = (duration: "today" | "weekly" | "monthly" | "yearly" | "all") => {
	return useQuery({ queryKey: ["byDuration", duration], queryFn: () => getLeadByDuration(duration) });
};
