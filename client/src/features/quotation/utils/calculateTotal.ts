import type { UseFormReturn } from "react-hook-form"
import type { AddQuotation } from "zs-crm-common";

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

export const calculateGrandTotal = (total: number, gst: number, roundOff: number, form: UseFormReturn<AddQuotation>,): number => {
    const grandTotal = total + gst + roundOff - form.watch("discount");
    return Number(grandTotal.toFixed(2));
}