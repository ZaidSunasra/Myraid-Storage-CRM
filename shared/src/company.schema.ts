import { Client_Details, Company, SuccessResponse } from "./common.schema";

export type GetCompanySuccessResponse = SuccessResponse & {
    companies: Company[]
}

export type GetEmployeeByCompanySuccessResponse = SuccessResponse & {
    employees: Client_Details[]
}