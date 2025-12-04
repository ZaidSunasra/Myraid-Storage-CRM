import type { GetOrderSuccessResponse, Order } from "zs-crm-common";

export const calculateTotalBody = (data: GetOrderSuccessResponse) => {
    const totalBody: number = data.orders.reduce((sum: number, order: Order) => sum + order.total_body, 0);
    return totalBody;
}

export const calculateTotalAmount = (data: GetOrderSuccessResponse) => {
    const totalAmount = data.orders.reduce((sum: number, order) => sum + order.balance, 0);
    return totalAmount;
}

export const calculateRemainingBalance = (data: any) => {
    const balancePaid = data.advance.reduce((sum: number, advance: any) => sum + advance.advance_amount, 0);
    const totalBalance = data.balance;
    const remainingBalance = totalBalance - balancePaid;
    return { remainingBalance, balancePaid };
}

export const getRowColor = (status: string) => {
    switch (status) {
        case "dispatched":
            return "bg-green-200 hover:bg-green-300";
        case "fabrication_ready":
            return "bg-blue-200 hover:bg-blue-300";
        case "ready":
            return "bg-slate-200 hover:bg-slate-300";
        default:
            return "";
    }
};