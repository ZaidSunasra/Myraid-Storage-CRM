import type {
	AddLead,
	GetLeadByIdSuccessResponse,
	GetLeadSuccessResponse,
	GetLeadByDurationSuccessResponse,
	SuccessResponse,
} from "zs-crm-common";
import axiosInstance from "../axiosInstance";

export const getLeads = async ({
	page = 1,
	search,
	employeeIDs,
	rows,
	startDate,
	endDate,
	sources
}: {
	page: number;
	search: string;
	employeeIDs: string[];
	rows: number;
	startDate: string;
	endDate: string;
	sources: string[];
}): Promise<GetLeadSuccessResponse> => {
	const response = await axiosInstance.get(`/leads/get?page=${page}&rows=${rows}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${sources}`);
	return response.data;
};

export const getLeadById = async (id: string): Promise<GetLeadByIdSuccessResponse> => {
	const response = await axiosInstance.get(`/leads/get/${id}`);
	return response.data;
};

export const getLeadByDuration = async (duration: "today" | "weekly" | "monthly" | "yearly" | "all"): Promise<GetLeadByDurationSuccessResponse> => {
	const response = await axiosInstance.get(`/leads/getBy/${duration}`);
	return response.data;
};

export const addLead = async (data: AddLead): Promise<SuccessResponse> => {
	const response = await axiosInstance.post("/leads/add", data);
	return response.data;
};

export const editLead = async ({ data, id }: { data: AddLead; id: string | undefined }): Promise<SuccessResponse> => {
	const response = await axiosInstance.put(`/leads/edit/${id}`, data);
	return response.data;
};
