export const calculateTotalBody = (data : any) => {
    const totalBody : number = data.orders.reduce((sum : number, order : any) => sum + order.total_body, 0);
    return totalBody;
}

export const calculateRemainingBalance = (data: any) => {
    const balancePaid = data.advance.reduce((sum: number, advance: any) => sum + advance.advance_amount, 0);
    const totalBalance = data.balance;
    const remainingBalance = totalBalance - balancePaid;
    return {remainingBalance, balancePaid};
}