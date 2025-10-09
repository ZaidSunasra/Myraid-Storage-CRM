import { z } from "zod/v4"
import { department, DEPARTMENTS } from "./auth.schema"
import { SuccessResponse } from "./common.schema"

export const editPermissionSchema = z.object({
  allowed_dept: z.enum(DEPARTMENTS).array()
})

export type EditPermission = z.infer<typeof editPermissionSchema>

export type GetPermissionOutput = {
    id: number,
    permission_key: string,
    allowed_dept: department[]
}

export type GetPermissionSuccessResponse = SuccessResponse & {
    permissions: GetPermissionOutput[]
}