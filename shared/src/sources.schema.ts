import { SuccessResponse } from "./common.schema"
import { z } from "zod/v4";

export const modifySourceSchema = z.object({
  name: z.string().min(1, "Name is required")
})
export type ModifySource = z.infer<typeof modifySourceSchema>

export type GetSourceOutput = {
    id: number;
    name: string;
}

export type GetSourceSuccessResponse = SuccessResponse & {
    sources: GetSourceOutput[];
}