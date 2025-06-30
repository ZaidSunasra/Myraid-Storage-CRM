import axiosInstance from "../axiosInstance"

export const getLeads = async({page = 1, search, employeeIDs} : {page: number, search: string, employeeIDs: string[]}) : Promise<any> => {
    const response = await axiosInstance.get(`/leads/get?page=${page}&search=${search}&employeeID=${employeeIDs}`);
    return response.data;
}

export const getEmployeee = async() : Promise<any> => {
    const response = await axiosInstance.get("/leads/fetchEmployee");
    return response.data;
}