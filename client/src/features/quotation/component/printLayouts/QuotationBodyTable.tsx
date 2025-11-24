import React from "react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import type { Quotation_Product } from "zs-crm-common"

const QuotationBodyTable = ({ product, isSetWise }: { product: Quotation_Product, isSetWise: boolean }) => {

    const isCompactor = product.name.startsWith("Compactor");

    if(!isCompactor) return <></>

    return <Table className=" w-3/5" key={product.id}>
        <TableHeader>
            <TableRow>
                <TableHead rowSpan={2} className="border border-black text-center">Sr. No</TableHead>
                <TableHead colSpan={3} className="border border-black text-center">Description of Goods</TableHead>
                <TableHead rowSpan={2} className="border border-black text-center">Installation Body</TableHead>
            </TableRow>
            <TableRow>
                <TableHead className="border border-black text-center">Per Bay Qty</TableHead>
                <TableHead className="border border-black text-center">Qty</TableHead>
                <TableHead className="border border-black text-center">Total</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {product.quotation_item.map((item, index: number) => {
                return <React.Fragment key={item.id}>
                    {item.item_name !== "DOOR" &&
                        <TableRow key={item.id}>
                            <TableCell className="border border-black text-center">{index + 1}</TableCell>
                            <TableCell className="border border-black">
                                <div>  {item.item_code} {product.name.split(" ")[2]} Bay </div>
                                <div> Body in {item.item_code}</div>
                            </TableCell>
                            <TableCell className="border border-black text-center">{item.per_bay_qty}</TableCell>
                            <TableCell className="border border-black text-center">{item.quantity}</TableCell>
                            <TableCell className="border border-black text-center">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                        </TableRow>
                    }
                </React.Fragment>
            })}
        </TableBody>
        <TableFooter>
            <TableRow className="border-white">
                <TableCell colSpan={2} className="bg-background"></TableCell>
                <TableCell colSpan={2} className="border border-black text-center">Total Body</TableCell>
                <TableCell className="border border-black text-center">{product.quotation_working[0].total_body}</TableCell>
            </TableRow>
            {isSetWise &&
                <TableRow>
                    <TableCell colSpan={2} className="bg-background"></TableCell>
                    <TableCell className="border border-black text-center">Set</TableCell>
                    <TableCell className="border border-black border-l-0 text-center">{product.quotation_working[0].set}</TableCell>
                    <TableCell className="border border-black text-center">{product.quotation_working[0].total_body * product.quotation_working[0].set}</TableCell>
                </TableRow>
            }
        </TableFooter>
    </Table >
}

export default QuotationBodyTable