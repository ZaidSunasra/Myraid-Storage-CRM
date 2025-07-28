import { SuccessResponse } from "./common.schema"

export type GetProductOutput = {
    id: number;
    name: string;
}

export type GetProductSuccessResponse = SuccessResponse & {
    products: GetProductOutput[];
}