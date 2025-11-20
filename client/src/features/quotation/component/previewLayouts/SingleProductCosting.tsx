import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";
import { calculatePerKgPreview } from "../../utils/calculateTotal";

const SingleProductCosting = () => {

    const { products, getProductItems, overallTotal } = useQuotation();

    return (
        <>
            {products.map((product) => {
                const { totalCost, difference, perKg, totalLabourCost } = calculatePerKgPreview(products, overallTotal)
                const items = getProductItems(product.id)
                return <React.Fragment key={product.id}>
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
                                <TableCell className="border border-black">
                                    {Number(product.ss_material) + Number(product.trolley_material)} * {product.set} = {product.set * (product.ss_material + product.trolley_material)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Total Weight</TableCell>
                                <TableCell className="border border-black">{product.total_weight}</TableCell>
                                <TableCell className="border border-black">{product.set}</TableCell>
                                <TableCell className="border border-black">{product.total_weight * product.set}</TableCell>
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
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{product.total_provided_rate}</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{product.total_market_rate}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Set</TableCell>
                                <TableCell>{product.set}</TableCell>
                                <TableCell>{(product.set * product.total_provided_rate).toFixed(2)}</TableCell>
                                <TableCell>{product.set}</TableCell>
                                <TableCell>{(product.set * product.total_market_rate).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    <Table className="border border-black">
                        <TableBody>
                            <TableRow>
                                <TableCell className="border border-black">Installation</TableCell>
                                <TableCell className="border border-black">{product.installation}</TableCell>
                                <TableCell className="border border-black">
                                    {product.installation * product.total_body} * {product.set} = {product.set * product.installation * product.total_body}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Accomodation</TableCell>
                                <TableCell className="border border-black"></TableCell>
                                <TableCell className="border border-black">
                                    {product.accomodation} * {product.set} = {product.set * product.accomodation}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Transport</TableCell>
                                <TableCell className="border border-black"></TableCell>
                                <TableCell className="border border-black">
                                    {product.transport} * {product.set} = {product.set * product.transport}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Table className="border border-black">
                        <TableBody>
                            <TableRow>
                                <TableCell className="border border-black">Total Cost</TableCell>
                                <TableCell className="border border-black"></TableCell>
                                <TableCell className="border border-black"> {totalCost.toFixed(2)} </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Grand Total - Total Cost</TableCell>
                                <TableCell className="border border-black">{overallTotal.toFixed(2)} - {totalCost.toFixed(2)}</TableCell>
                                <TableCell className="border border-black">{difference.toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Profit + Labour Cost</TableCell>
                                <TableCell className="border border-black">{difference.toFixed(2)} + {totalLabourCost.toFixed(2)}</TableCell>
                                <TableCell className="border border-black">{(difference + totalLabourCost).toFixed(2)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border border-black">Per Kg</TableCell>
                                <TableCell className="border border-black"></TableCell>
                                <TableCell className="border border-black">{perKg.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </React.Fragment>
            })}
        </>
    )
}

export default SingleProductCosting