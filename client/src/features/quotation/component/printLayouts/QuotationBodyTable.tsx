import React from "react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { Quotation_Product } from "zs-crm-common"

const QuotationBodyTable = ({ product, isSetWise }: { product: Quotation_Product, isSetWise: boolean }) => {

    const isCompactor = product.name.toLowerCase().includes("compactor");

    if(!isCompactor) return <></>

    return <Table className=" w-3/5" key={product.id}>
        <TableHeader>
            <TableRow>
                <TableHead rowSpan={2} className="border border-black">Sr. No</TableHead>
                <TableHead colSpan={3} className="border border-black">Description of Goods</TableHead>
                <TableHead rowSpan={2} className="border border-black">Installation Body</TableHead>
            </TableRow>
            <TableRow>
                <TableHead className="border border-black">Per Bay Qty</TableHead>
                <TableHead className="border border-black">Qty</TableHead>
                <TableHead className="border border-black">Total</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {product.quotation_item.map((item, index: number) => {
                return <React.Fragment key={item.id}>
                    {item.item_name !== "DOOR" &&
                        <TableRow key={item.id}>
                            <TableCell className="border border-black">{index + 1}</TableCell>
                            <TableCell className="border border-black">
                                <div>  {item.item_code} {product.name[0]} Bay </div>
                                <div> Body in {item.item_code}</div>
                            </TableCell>
                            <TableCell className="border border-black">{item.per_bay_qty}</TableCell>
                            <TableCell className="border border-black">{item.quantity}</TableCell>
                            <TableCell className="border border-black">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                        </TableRow>
                    }
                </React.Fragment>
            })}
        </TableBody>
        <TableFooter>
            <TableRow className="border-white">
                <TableCell colSpan={2} className="bg-background"></TableCell>
                <TableCell colSpan={2} className="border border-black">Total Body</TableCell>
                <TableCell className="border border-black">{product.quotation_working[0].total_body}</TableCell>
            </TableRow>
            {isSetWise &&
                <TableRow>
                    <TableCell colSpan={2} className="bg-background"></TableCell>
                    <TableCell className="border border-black border-r-0">Set</TableCell>
                    <TableCell className="border border-black border-l-0">{product.quotation_working[0].set}</TableCell>
                    <TableCell className="border border-black">{product.quotation_working[0].total_body * product.quotation_working[0].set}</TableCell>
                </TableRow>
            }
        </TableFooter>
    </Table >
}

export default QuotationBodyTable