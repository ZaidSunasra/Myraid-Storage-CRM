import { SuccessResponse } from "./common.schema"

export type GetEmployeeOutput = {
    first_name: string;
    last_name: string;
    id: number;
    quotation_code? : string | null;
}

export type GetEmployeeSuccessResponse = SuccessResponse & {
    employees: GetEmployeeOutput[];
}
