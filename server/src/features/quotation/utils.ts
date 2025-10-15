import { GetQuotationOutput } from "zs-crm-common";

export const convertQuotationArray = (quotation : any) : GetQuotationOutput[]=> {
return quotation.map((q: any) => ({
        ...q,
        grand_total: q.grand_total.toNumber(),
        gst: q.gst.toNumber(),
        round_off: q.round_off.toNumber(),
        sub_total: q.sub_total.toNumber(),
        quotation_products: q.quotation_products.map((qp : any) => ({
            ...qp,
            quotation_item: qp.quotation_item.map((item : any) => ({
                ...item,
                market_rate: item.market_rate.toNumber(),
                provided_rate: item.provided_rate.toNumber(),
            })),
            quotation_working: qp.quotation_working.map((work: any) => ({
                ...work,
                accomodation: work.accomodation.toNumber(),
                installation: work.installation.toNumber(),
                labour_cost: work.labour_cost.toNumber(),
                market_total_cost: work.market_total_cost.toNumber(),
                powder_coating: work.powder_coating.toNumber(),
                provided_total_cost: work.provided_total_cost.toNumber(),
                total_weight: work.total_weight.toNumber(),
                transport: work.transport.toNumber(),
                ss_material: work.ss_material.toNumber(),
                trolley_material: work.trolley_material.toNumber(),
                discount: work.discount.toNumber()
            })),
        })),
    }));
}

export const convertQuotation = (quotation : any) : GetQuotationOutput=> {
    const convertedQuotation = {
        ...quotation,
        grand_total: quotation.grand_total.toNumber(),
        gst: quotation.gst.toNumber(),
        round_off: quotation.round_off.toNumber(),
        sub_total: quotation.sub_total.toNumber(),
        quotation_products: quotation.quotation_products.map((qp : any) => ({
            ...qp,
            quotation_item: qp.quotation_item.map((item : any) => ({
                ...item,
                market_rate: item.market_rate.toNumber(),
                provided_rate: item.provided_rate.toNumber(),
            })),
            quotation_working: qp.quotation_working.map((work : any) => ({
                ...work,
                accomodation: work.accomodation.toNumber(),
                installation: work.installation.toNumber(),
                labour_cost: work.labour_cost.toNumber(),
                market_total_cost: work.market_total_cost.toNumber(),
                powder_coating: work.powder_coating.toNumber(),
                provided_total_cost: work.provided_total_cost.toNumber(),
                total_weight: work.total_weight.toNumber(),
                transport: work.transport.toNumber(),
                ss_material: work.ss_material.toNumber(),
                trolley_material: work.trolley_material.toNumber(),
                discount: work.discount.toNumber(),
            })),
        })),
    };
    return convertedQuotation;
}