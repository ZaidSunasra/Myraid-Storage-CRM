import {DEPARTMENTS} from "zs-crm-common";

type department = typeof DEPARTMENTS[number]; 

export type LoginSuccessResponse = {
    message: string,
    userData: {
        email: string,
        code: string | null,
        name: string,
        department: department
    }
};

export type LoginFailureResponse = {
    message: string,
    error?: any
};

export type SignupResponse = LoginFailureResponse;
