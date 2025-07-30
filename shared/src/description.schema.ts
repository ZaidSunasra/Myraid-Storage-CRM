import { z } from "zod/v4";
import { SuccessResponse } from "./common.schema";

export const addDescriptionSchema = z.object({
    description: z.string().min(1, "Description required"),
    type: z.enum(["deal", "lead"])
})

export type AddDescription = z.infer<typeof addDescriptionSchema>


export type GetDescriptionByIdOutput = {
    id: number;
    lead_id: number | null;
    deal_id: string | null;
    created_at: Date;
    updated_at: Date | null;
    notes: string;
    updated_by: number;
};

export type GetDescriptionByIdSuccessResponse = SuccessResponse & {
    description: GetDescriptionByIdOutput | null;
};

export type GetDescriptionOutput = GetDescriptionByIdOutput & {
    user: {
        first_name: string;
        last_name: string;
    }
}

export type GetDescriptionSuccessResponse = SuccessResponse & {
    descriptions: GetDescriptionOutput[];
}