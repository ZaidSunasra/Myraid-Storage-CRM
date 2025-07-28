import { SuccessResponse } from "./common.schema"

export type GetSourceOutput = {
    id: number;
    name: string;
}

export type GetSourceSuccessResponse = SuccessResponse & {
    sources: GetSourceOutput[];
}