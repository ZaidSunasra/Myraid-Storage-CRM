import axiosInstance from "../axiosInstance"

export const convertLeadToDeal = async (id: string) : Promise<any> => {
    const response = await axiosInstance.post(`/deals/convert/${id}`);
    return response.data;
}

export const getDeals = async({rows, page, employeeIDs, search, startDate, endDate, sources}: {rows: number, page: number, employeeIDs: string[], search: string, startDate: string, endDate: string, sources: string[]}) : Promise<any> => {
    const response = await axiosInstance.get(`/deals/get?rows=${rows}&page=${page}&search=${search}&employeeID=${employeeIDs}&startDate=${startDate}&endDate=${endDate}&sources=${sources}`);
    return response.data;
}