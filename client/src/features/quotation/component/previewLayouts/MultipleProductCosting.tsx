import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";

const MultipleProductCosting = () => {

    const { products, getProductItems } = useQuotation();

    return (
        <React.Fragment >
            <Table className="border border-black">
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr. No</TableHead>
                        <TableHead>Labour</TableHead>
                        <TableHead>SS</TableHead>
                        <TableHead>Trolley</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Powder Coating</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => {
                        return (
                            <TableRow key={product.id} >
                                <TableCell>{String.fromCharCode(65 + index)}</TableCell>
                                <TableCell>{product.labour_cost}</TableCell>
                                <TableCell>{product.ss_material}</TableCell>
                                <TableCell>{product.trolley_material}</TableCell>
                                <TableCell>{product.ss_material + product.trolley_material}</TableCell>
                                <TableCell>{product.total_weight}</TableCell>
                                <TableCell>{product.powder_coating}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow className="font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.labour_cost, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.ss_material, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.trolley_material, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + (p.ss_material + p.trolley_material), 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.total_weight, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.powder_coating, 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <Table className="border border-black">
                <TableHeader>
                    <TableRow>
                        <TableHead>Sr</TableHead>
                        <TableHead>Installation</TableHead>
                        <TableHead>Total Installation</TableHead>
                        <TableHead>Accomodation</TableHead>
                        <TableHead>Transport</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product, index) => {
                        return (
                            <TableRow key={product.id} >
                                <TableCell>{String.fromCharCode(65 + index)}</TableCell>
                                <TableCell>{product.installation}</TableCell>
                                <TableCell>{product.installation * product.set * product.total_body}</TableCell>
                                <TableCell>{product.accomodation}</TableCell>
                                <TableCell>{product.transport}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow className="font-bold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.installation * p.total_body, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + p.accomodation, 0)}
                        </TableCell>
                        <TableCell>
                            {products.reduce((sum, p) => sum + (p.transport), 0)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            {products.map(product => {
                const items = getProductItems(product.id)
                return (
                    <Table className="border border-black" key={product.id}>
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
                )
            })}
            {/* <Table className="border border-black">
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
                    </Table> */}
        </React.Fragment>
    )
}

export default MultipleProductCosting