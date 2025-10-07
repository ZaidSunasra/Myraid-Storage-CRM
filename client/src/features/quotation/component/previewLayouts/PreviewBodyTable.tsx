import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";
import type { AddQuotation } from "zs-crm-common";

const PreviewBodyTable = ({data} : {data: AddQuotation}) => {
    const { products, getProductItems} = useQuotation();
    return (
        <>
            {products.map((product) => {
                const items = getProductItems(product.id)
                return (
                    <Table key={product.id}>
                        <TableHeader>
                            <TableRow>
                                <TableHead rowSpan={2} className="border border-black">Sr. No</TableHead>
                                <TableHead colSpan={3} className="border border-black max-w-sm">Description of Goods</TableHead>
                                <TableHead rowSpan={2} className="border border-black">Installation Body</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border border-black">Name</TableHead>
                                <TableHead className="border border-black">Per bay qty</TableHead>
                                <TableHead className="border border-black"> Qty</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index: number) => (
                                <React.Fragment key={item.id}>
                                    {
                                        item.name !== "DOOR" &&
                                        <TableRow key={item.id}>
                                            <TableCell className="border border-black">{index + 1} </TableCell>
                                            <TableCell className="border border-black max-wd-sm whitespace-normal break-words">{item.name}</TableCell>
                                            <TableCell className="border border-black">{item.per_bay_qty}</TableCell>
                                            <TableCell className="border border-black">{item.quantity}</TableCell>
                                            <TableCell className="border border-black">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                                        </TableRow>
                                    }
                                </React.Fragment>
                            ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow className="border-white">
                                <TableCell colSpan={2} className="bg-background"></TableCell>
                                <TableCell colSpan={2} className="border border-black">Total Body</TableCell>
                                <TableCell className="border border-black">{product.total_body}</TableCell>
                            </TableRow>
                            {data.quotation_template === "set_wise" &&
                                <TableRow>
                                    <TableCell colSpan={2} className="bg-background"></TableCell>
                                    <TableCell className="border border-black border-r-0">Set</TableCell>
                                    <TableCell className="border border-black border-l-0">{product.set}</TableCell>
                                    <TableCell className="border border-black">{product.total_body * product.set}</TableCell>
                                </TableRow>
                            }
                        </TableFooter>
                    </Table>
                )
            })}
        </>
    )
}

export default PreviewBodyTable