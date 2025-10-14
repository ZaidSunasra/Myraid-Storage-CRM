import { Request, Response } from "express"
import { addOrderSchema, ErrorResponse, SuccessResponse } from "zs-crm-common";
import { addOrderService, addPaymentService, deletePaymentService, editPaymentService, getOrderByIdService, GetOrderOutput, getOrderService, Order } from "./orders.service";
import z from "zod/v4";
import { SubBusinessDaysOptions } from "date-fns";

export const addOrderController = async (req: Request, res: Response<ErrorResponse | SuccessResponse>): Promise<any> => {
    const { quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, colour, deal_id } = req.body;
    console.log(req.body)
    const validation = addOrderSchema.safeParse({ ...req.body, dispatch_at: new Date(dispatch_at) });
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addOrderService({ quotation_no, height, total, total_body, pi_number, po_number, dispatch_at, status, colour, deal_id });
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
export type GetOrderSuccessResponse = SuccessResponse & GetOrderOutput
export const getOrderController = async (req: Request, res: Response<GetOrderSuccessResponse | ErrorResponse>): Promise<any> => {
    const user = res.locals.user;
    const rows = parseInt(req.query.rows as string);
    const page = parseInt(req.query.page as string);
    const search = req.query.search as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const employees = req.query.employeeID as string | undefined;
    const sources = req.query.sources as string | undefined;
    const employeeId = employees ? employees.split(",").filter(Boolean) : [];
    try {
        const { orders, totalOrders } = await getOrderService(user, rows, page, search, startDate, endDate, employeeId);
        return res.status(200).json({
            message: `Order fetched  successfully`,
            totalOrders,
            orders
        })
    } catch (error) {
        console.log(`Error in fetching order`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export type GetOrderByIdSuccessResponse = SuccessResponse & {
    order: Order | null
}
export const getOrderByIdController = async (req: Request, res: Response<GetOrderByIdSuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        const order = await getOrderByIdService(id);
        return res.status(200).json({
            message: `Order with ${id} fetched  successfully`,
            order
        })
    } catch (error) {
        console.log(`Error in fetching order by Id:${id}`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const addPaymentSchema = z.object({
    amount: z.number().min(1, "Amount is required"),
    date: z.date("Date is required")
});

export type AddPayment = z.infer<typeof addPaymentSchema>
export const addPaymentController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { amount, date } = req.body;
    const order_id = req.params.order_id;
    const validation = addPaymentSchema.safeParse({ ...req.body, date: new Date(date) });
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await addPaymentService({ amount, date }, order_id);
        return res.status(200).json({
            message: `Payment added successfully`,
        })
    } catch (error) {
        console.log(`Error in adding payment`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const editPaymentController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const { amount, date } = req.body;
    const id = req.params.id;
    const validation = addPaymentSchema.safeParse({ ...req.body, date: new Date(date) });
    if (!validation.success) {
        return res.status(400).json({
            message: "Input validation error",
            error: validation.error.issues
        })
    }
    try {
        await editPaymentService({ date, amount }, id);
        return res.status(200).json({
            message: `Payment edited successfully`,
        })
    } catch (error) {
        console.log(`Error in editing payment`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}

export const deletePaymentController = async (req: Request, res: Response<SuccessResponse | ErrorResponse>): Promise<any> => {
    const id = req.params.id;
    try {
        await deletePaymentService(id);
        return res.status(200).json({
            message: `Payment deleted successfully`,
        })
    } catch (error) {
        console.log(`Error in deleting payment`, error);
        return res.status(500).send({
            message: "Internal server error",
            error: error
        });
    }
}