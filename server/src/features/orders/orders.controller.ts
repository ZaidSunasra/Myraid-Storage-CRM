import {Request, Response} from "express"
import { addOrderSchema, ErrorResponse, SuccessResponse } from "zs-crm-common";
import { addOrderService } from "./orders.service";

export const addOrderController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const {quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, colour, deal_id} = req.body;
    console.log(req.body)
    const validation = addOrderSchema.safeParse({...req.body, dispatch_at: new Date(dispatch_at)});
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addOrderService({quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, colour, deal_id});
        return res.status(200).json({
            message: `Order added  successfully`,
        })
    } catch (error) {
        console.log(`Error in adding order`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}