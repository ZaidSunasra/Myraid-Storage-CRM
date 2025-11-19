import type { UseFormReturn } from "react-hook-form"
import type { AddQuotation, Quotation_Item, Quotation_Product, QuotationItem, QuotationProduct } from "zs-crm-common";

export const calculateTotal = (form: UseFormReturn<AddQuotation>): number => {
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

export const calculatePrintProductTotal = (product: Quotation_Product, item?: Quotation_Item) => {
    const extraExpense = Number(product.quotation_working[0].installation) * Number(product.quotation_working[0].total_body) + Number(product.quotation_working[0].accomodation) + Number(product.quotation_working[0].transport);
    const perBodyExpense = product.quotation_working[0].total_body === 0 ? 0 : extraExpense / Number(product.quotation_working[0].total_body);
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = 1 + product.quotation_working[0].profit_percent / 100;
    const itemWiseProfit = itemWisetotal * profitPercent;
    const setWiseTotal = Number(product.quotation_working[0].provided_total_cost) + extraExpense;
    const setWiseProfit = setWiseTotal * profitPercent;
    return { setWiseTotal, setWiseProfit, itemWiseProfit };
}

export const calculatePreviewProductTotal = (product: QuotationProduct, item?: QuotationItem) => {
    const extraExpense = Number(product.installation) * Number(product.total_body) + Number(product.accomodation) + Number(product.transport);
    const perBodyExpense = product.total_body === 0 ? 0 : extraExpense / Number(product.total_body);
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = product.profit_percent / 100;
    const itemWiseProfit = itemWisetotal * (1 + profitPercent);
    const setWiseTotal = Number(product.total_provided_rate) + extraExpense;
    const setWiseProfit = setWiseTotal * (1 + profitPercent);
    return { setWiseTotal, setWiseProfit, itemWiseProfit, profitPercent };
}

export const calculatePreviewMultiProductTotals = (products: QuotationProduct[], item: QuotationItem, product: QuotationProduct) => {
    const totalExtraExpense = products.reduce((sum, p) => {
        return (
            sum +
            Number(p.installation) * Number(p.total_body) +
            Number(p.accomodation) +
            Number(p.transport)
        );
    }, 0);
    const totalBodies = products.reduce(
        (sum, p) => sum + Number(p.total_body),
        0
    );
    const perBodyExpense = totalExtraExpense / totalBodies;
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = product.profit_percent / 100;
    const itemWiseProfit = itemWisetotal * (1 + profitPercent);
    const setWiseTotal = Number(product.total_provided_rate) + Number(product.total_body) * perBodyExpense;
    const setWiseProfit = setWiseTotal * (1 + profitPercent);
    return { setWiseTotal, setWiseProfit, itemWiseProfit, profitPercent };
};

export const calculatePrintMultiProductTotals = (products: Quotation_Product[], item: Quotation_Item, product: Quotation_Product) => {
    const totalExtraExpense = products.reduce((sum, p) => {
        return (
            sum +
            Number(p.quotation_working[0].installation) * Number(p.quotation_working[0].total_body) +
            Number(p.quotation_working[0].accomodation) +
            Number(p.quotation_working[0].transport)
        );
    }, 0);
    const totalBodies = products.reduce(
        (sum, p) => sum + Number(p.quotation_working[0].total_body),
        0
    );
    const perBodyExpense = totalExtraExpense / totalBodies;
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = product.quotation_working[0].profit_percent / 100;
    const itemWiseProfit = itemWisetotal * (1 + profitPercent);
    const setWiseTotal = Number(product.quotation_working[0].provided_total_cost) + Number(product.quotation_working[0].total_body) * perBodyExpense;
    const setWiseProfit = setWiseTotal * (1 + profitPercent);
    return { setWiseTotal, setWiseProfit, itemWiseProfit, profitPercent };
};

export const calculatePerKgPreview = (products: QuotationProduct[], overallTotal: number) => {
    const marketTotal = products.reduce((sum, p) => sum + p.total_market_rate * p.set, 0)
    const grandTotal = overallTotal;
    const totalInstallationCost = products.reduce((sum, p) => sum + p.installation * p.total_body * p.set, 0);
    const transportAccomodationCost = products.reduce((sum, p) => sum + p.transport * p.set + p.accomodation * p.set, 0);
    const totalLabourCost = products.reduce((sum, p) => sum + p.labour_cost * p.set, 0)
    const totalMaterial = products.reduce((sum, p) => sum + (p.ss_material + p.trolley_material) * p.set, 0);
    const totalCost = marketTotal + totalInstallationCost + transportAccomodationCost;
    const difference = grandTotal - totalCost;
    const perKg = (difference + totalLabourCost ) / totalMaterial;
    return {perKg, difference, totalCost}
}