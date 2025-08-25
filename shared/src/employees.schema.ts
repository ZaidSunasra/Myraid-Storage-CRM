import { department } from "./auth.schema";
import { SuccessResponse } from "./common.schema"

export type GetAllEmployeeOutput = {
    first_name: string;
    last_name: string;
    id: number;
    email: string,
    phone: string,
    department: department, 
    quotation_code? : string | null,
}

export type GetEmployeeOutput = {
    first_name: string;
    last_name: string;
    id: number;
    quotation_code? : string | null;
}

export type GetAllEmployeeSuccessResponse = SuccessResponse & {
    employees: GetAllEmployeeOutput[]
}

export type GetEmployeeSuccessResponse = SuccessResponse & {
    employees: GetEmployeeOutput[];
}
