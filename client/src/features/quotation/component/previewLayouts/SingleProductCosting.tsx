import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";
import { calculatePreviewProductTotal } from "../../utils/calculateTotal";

const SingleProductCosting = () => {

    const {products, getProductItems} = useQuotation();

    return (
        <>
            {products.map((product) => {
                const { setWiseTotal, setWiseProfit, profitPercent } = calculatePreviewProductTotal(product)
                const items = getProductItems(product.id)
                return  <React.Fragment key={product.id}>
                        <Table className="border border-black">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="border border-black">Labour Cost</TableCell>
                                    <TableCell className="border border-black">{product.labour_cost}</TableCell>
                                    <TableCell className="border border-black">{product.set}</TableCell>
                                    <TableCell className="border border-black">{Number(product.labour_cost) * Number(product.set)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Material</TableCell>
                                    <TableCell className="border border-black">{product.ss_material}</TableCell>
                                    <TableCell className="border border-black">{product.trolley_material}</TableCell>
                                    <TableCell className="border border-black">{Number(product.ss_material) + Number(product.trolley_material)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Total Weight</TableCell>
                                    <TableCell className="border border-black"></TableCell>
                                    <TableCell className="border border-black"></TableCell>
                                    <TableCell className="border border-black">{product.total_weight}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Powder Coating</TableCell>
                                    <TableCell className="border border-black">{product.powder_coating}</TableCell>
                                    <TableCell className="border border-black">{product.set}</TableCell>
                                    <TableCell className="border border-black">{Number(product.powder_coating) * Number(product.set)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table className="border border-black">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="border border-black">Qty</TableHead>
                                    <TableHead className="border border-black">Provided Rate</TableHead>
                                    <TableHead className="border border-r-2 border-black">Total</TableHead>
                                    <TableHead className="border border-black">Market Rate</TableHead>
                                    <TableHead className="border border-black">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="border border-black">{item.quantity}</TableCell>
                                        <TableCell className="border border-black">{item.provided_rate}</TableCell>
                                        <TableCell className="border border-r-2 border-black">{Number(item.quantity) * Number(item.provided_rate)}</TableCell>
                                        <TableCell className="border border-black">{item.market_rate}</TableCell>
                                        <TableCell className="border border-black">{Number(item.quantity) * Number(item.market_rate)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Table className="border border-black">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="border border-black">Installation</TableCell>
                                    <TableCell className="border border-black">{product.installation}</TableCell>
                                    <TableCell className="border border-black">{Number(product.installation) * Number(product.total_body)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Accomodation</TableCell>
                                    <TableCell className="border border-black"></TableCell>
                                    <TableCell className="border border-black">{product.accomodation}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Transport</TableCell>
                                    <TableCell className="border border-black"></TableCell>
                                    <TableCell className="border border-black">{product.transport}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Table className="border border-black">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="border border-black">Total</TableCell>
                                    <TableCell className="border border-black"></TableCell>
                                    <TableCell className="border border-black"> {setWiseTotal} </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Profit (%)</TableCell>
                                    <TableCell className="border border-black">{product.profit_percent}</TableCell>
                                    <TableCell className="border border-black">{(profitPercent * setWiseTotal).toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="border border-black">Set</TableCell>
                                    <TableCell className="border border-black">{product.set}</TableCell>
                                    <TableCell className="border border-black">{Number(setWiseProfit.toFixed(2)) * Number(product.set) * Number(1 - product.discount / 100)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </React.Fragment>
            })}
        </>
    )
}

export default SingleProductCosting