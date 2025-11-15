import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";
import type { AddQuotation } from "zs-crm-common";

const PreviewBodyTable = ({ data }: { data: AddQuotation }) => {
    const { products, getProductItems } = useQuotation();
    const compactorProducts = products.filter((product) =>
        product.name.startsWith("Compactor")
    );
    return (
        <>
           {compactorProducts.map((product) => {
                const items = getProductItems(product.id);
                const isCompactor = product.name.startsWith("Compactor");
                if(!isCompactor) return <></>
                return (
                    <Table key={product.id}>
                        <TableHeader>
                            <TableRow>
                                <TableHead rowSpan={2} className="border border-black text-center">Sr. No</TableHead>
                                <TableHead colSpan={3} className="border border-black max-w-sm text-center">Description of Goods</TableHead>
                                <TableHead rowSpan={2} className="border border-black text-center">Installation Body</TableHead>
                            </TableRow>
                            <TableRow>
                                <TableHead className="border border-black text-center">Name</TableHead>
                                <TableHead className="border border-black text-center">Per bay qty</TableHead>
                                <TableHead className="border border-black text-center"> Qty</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index: number) => (
                                <React.Fragment key={item.id}>
                                    {
                                        item.name !== "DOOR" &&
                                        <TableRow key={item.id}>
                                            <TableCell className="border border-black text-center">{index + 1} </TableCell>
                                            <TableCell className="border border-black max-wd-sm whitespace-normal break-words">{item.name}</TableCell>
                                            <TableCell className="border border-black text-center">{item.per_bay_qty}</TableCell>
                                            <TableCell className="border border-black text-center">{item.quantity}</TableCell>
                                            <TableCell className="border border-black text-center">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                                        </TableRow>
                                    }
                                </React.Fragment>
                            ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow className="border-white">
                                <TableCell colSpan={2} className="bg-background"></TableCell>
                                <TableCell colSpan={2} className="border border-black text-center">Total Body</TableCell>
                                <TableCell className="border border-black text-center">{product.total_body}</TableCell>
                            </TableRow>
                            {data.quotation_template === "set_wise" &&
                                <TableRow>
                                    <TableCell colSpan={2} className="bg-background"></TableCell>
                                    <TableCell className="border border-black border-r-0 text-center">Set</TableCell>
                                    <TableCell className="border border-black text-center">{product.set}</TableCell>
                                    <TableCell className="border border-black text-center">{product.total_body * product.set}</TableCell>
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