import { SuccessResponse } from "./common.schema"

export type GetEmployeeOutput = {
    first_name: string;
    last_name: string;
    id: number;
}

export type GetEmployeeSuccessResponse = SuccessResponse & {
    employees: GetEmployeeOutput[];
}
