import { SuccessResponse } from "./common.schema"
import { z } from "zod/v4";

export const modifyProductSchema = z.object({
  name: z.string().min(1, "Name is required")
})
export type ModifyProduct = z.infer<typeof modifyProductSchema>

export type GetProductOutput = {
    id: number;
    name: string;
}

export type GetProductSuccessResponse = SuccessResponse & {
    products: GetProductOutput[];
}