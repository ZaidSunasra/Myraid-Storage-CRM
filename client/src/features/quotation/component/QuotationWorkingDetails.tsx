import { Card, CardHeader, CardTitle, CardContent, } from "@/shared/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody, TableFooter, } from "@/shared/components/ui/table"
import type { GetQuotationOutput } from "zs-crm-common";

const QuotationWorkingDetails = ({ data }: { data: GetQuotationOutput }) => {

    return <>
        {data.quotation_products.map((product) => {
            const working = product.quotation_working[0] ?? [];
            const productTotal = Number(working.provided_total_cost) + Number(working.installation) * Number(working.total_body) + Number(working.transport) + Number(working.accomodation);
            const profitTotal = productTotal * (1 + Number(working.profit_percent) / 100);
            return (
                <Card className="bg-background shadow-md rounded-2xl" key={product.id}>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Quotation Working of - {product.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <Table className="border">
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="border-r">Labour Cost</TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r">{working.labour_cost}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-r">KG</TableCell>
                                        <TableCell className="border-r">{working.ss_material}</TableCell>
                                        <TableCell className="border-r">{working.trolley_material}</TableCell>
                                        <TableCell className="border-r">{Number(working.ss_material) + Number(working.trolley_material)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-r">Total Weight</TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r">{working.total_weight}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-r">Powder Coating</TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r">{working.powder_coating}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Items</h3>
                            <div className="overflow-x-auto">
                                <Table className="border">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="border-r">Item</TableHead>
                                            <TableHead className="border-r">Qty</TableHead>
                                            <TableHead className="border-r">Provided Rate</TableHead>
                                            <TableHead className="border-r">Total</TableHead>
                                            <TableHead className="border-r">Market Rate</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {product.quotation_item.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="border-r">
                                                    <div className="font-medium">{item.item_name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {item.item_code}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="border-r">{item.quantity}</TableCell>
                                                <TableCell className="border-r">{item.provided_rate}</TableCell>
                                                <TableCell className="border-r"> {item.provided_rate * item.quantity} </TableCell>
                                                <TableCell className="border-r">{item.market_rate}</TableCell>
                                                <TableCell>{item.market_rate * item.quantity}</TableCell>
                                            </TableRow>
                                        )
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={2}>Total</TableCell>
                                            <TableCell colSpan={2} className="text-right">{working.provided_total_cost}</TableCell>
                                            <TableCell colSpan={2} className="text-right">{working.market_total_cost}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                        <div>
                            <Table className="border">
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="border-r">Installation</TableCell>
                                        <TableCell className="border-r">{working.installation}</TableCell>
                                        <TableCell className="border-r">{Number(working.installation) * Number(working.total_body)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-r">Accomodation</TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r">{working.accomodation}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-r">Transport</TableCell>
                                        <TableCell className="border-r"></TableCell>
                                        <TableCell className="border-r">{working.transport}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div>
                            <Table className="border">
                                <TableFooter>
                                    <TableRow>
                                        <TableCell>Total</TableCell>
                                        <TableCell>{productTotal}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>With Profit ({working.profit_percent}%)</TableCell>
                                        <TableCell>{(profitTotal).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
    </>
}

export default QuotationWorkingDetails
