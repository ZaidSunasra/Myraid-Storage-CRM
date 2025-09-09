import type { UseFormReturn } from "react-hook-form"
import type { AddQuotation } from "zs-crm-common";

export const calculateTotal = (totalProvidedRate: number, form: UseFormReturn<AddQuotation>): number => {
    const total = totalProvidedRate + Number(form.watch("accomodation")) + Number(form.watch("transport")) + Number(form.watch("installation"));
    return total;
}

export const calculateGSTTotal = (total: number, form: UseFormReturn<AddQuotation>): number => {
    const fraction = Number(form.watch("gst")) / 100 || 0;
    const gstAmount = total * fraction;
    return Number(gstAmount.toFixed(2));
}

export const calculateRoundOff = (total: number, gst: number): number => {
    const grandTotal = total + gst;
    const rounded = Math.floor(grandTotal); 
    return Number((rounded - grandTotal).toFixed(2)); 
}

export const calculateGrandTotal = (total: number, gst: number, roundOff: number, form: UseFormReturn<AddQuotation>,): number => {
    const grandTotal = total + gst + roundOff - form.watch("discount");
    return Number(grandTotal.toFixed(2));
}