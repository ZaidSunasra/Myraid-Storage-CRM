import { useQuotation } from "@/context/QuotationContext"
import { Table,  TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import type { AddQuotation } from "zs-crm-common";
import ItemWiseItemTable from "./ItemWiseItemTable";
import SetWiseItemTable from "./SetWiseItemTable";

const PreviewItemTable = ({ isDiscountGiven, data}: { isDiscountGiven: boolean, data: AddQuotation}) => {

    const { overallTotal } = useQuotation();

    return (
        <Table className="border border-black">
            <TableHeader>
                <TableRow>
                    <TableHead className="border border-black w-12 text-center">
                        Sr. No
                    </TableHead>
                    <TableHead className="border border-black max-w-sm">
                        Description of Goods
                    </TableHead>
                    <TableHead className="border border-black text-center">
                        Qty
                    </TableHead>
                    <TableHead className="border border-black text-center">
                        Rate
                    </TableHead>
                    {isDiscountGiven &&
                        <>
                            <TableHead className="border border-black text-center">
                                Discount
                            </TableHead>
                            <TableHead className="border border-black text-center">
                                Disc. Rate
                            </TableHead>
                        </>
                    }
                    <TableHead className="border border-black text-center">
                        Amount
                    </TableHead>
                </TableRow>
            </TableHeader>
            {data.quotation_template === "item_wise" ?
                <ItemWiseItemTable isDiscountGiven={isDiscountGiven} />
                : <SetWiseItemTable isDiscountGiven={isDiscountGiven} />
            }
            <TableFooter>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="border-r border-black"></TableCell>
                    <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">Total</TableCell>
                    <TableCell>{overallTotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="border-r border-black"></TableCell>
                    <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">GST {data.gst}%</TableCell>
                    <TableCell>{(Number(overallTotal) * data.gst / 100).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="border-r border-black"></TableCell>
                    <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">Round Off</TableCell>
                    <TableCell>{data.round_off}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="border-r border-black"></TableCell>
                    <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-2 border-black border-r-0">Grand Total</TableCell>
                    <TableCell className="border-2 border-black border-l-0">{data.grandTotal}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default PreviewItemTable