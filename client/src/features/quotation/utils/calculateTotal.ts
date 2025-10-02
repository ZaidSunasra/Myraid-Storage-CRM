import type { UseFormReturn } from "react-hook-form"
import type { AddQuotation, Quotation_Item, Quotation_Product } from "zs-crm-common";

export const calculateTotal = ( form: UseFormReturn<AddQuotation>): number => {
    const quotationItems = form.watch("quotation_item") || [];
    const productsTotal = quotationItems.reduce((sum, item) => {
        return sum + (
            (Number(item.accomodation)) +
            (Number(item.transport)) +
            (Number(item.installation)) +
            (Number(item.total_provided_rate))
            
        );
    }, 0);
    return Number(productsTotal.toFixed(2));
};

export const calculateGSTTotal = (total: number, form: UseFormReturn<AddQuotation>): number => {
    const fraction = Number(form.watch("gst")) / 100 || 0;
    const gstAmount = total * fraction;
    return Number(gstAmount.toFixed(2));
}

export const calculateRoundOff = (total: number, gst: number): number => {
    const grandTotal = total + gst;
    const rounded = Math.round(grandTotal); 
    return Number((rounded - grandTotal).toFixed(2)); 
}

export const calculateGrandTotal = (total: number, gst: number, roundOff: number,): number => {
    const grandTotal = total + gst + roundOff
    return Number(grandTotal.toFixed(2));
}

export const calculateProductTotal = (product: Quotation_Product, item?: Quotation_Item) => {
    const extraExpense = Number(product.quotation_working[0].installation) * Number(product.quotation_working[0].total_body) + Number(product.quotation_working[0].accomodation) + Number(product.quotation_working[0].transport);
    const perBodyExpense = extraExpense / Number(product.quotation_working[0].total_body);
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = 1 + product.quotation_working[0].profit_percent / 100;
    const itemWiseProfit = itemWisetotal * profitPercent;
    const setWiseTotal = Number(product.quotation_working[0].provided_total_cost) + extraExpense;
    const setWiseProfit = setWiseTotal * profitPercent;
    return { setWiseTotal, setWiseProfit, itemWiseProfit };
  }
