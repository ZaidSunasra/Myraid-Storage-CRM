import { Card, CardHeader, CardTitle, CardContent, } from "@/shared/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody, TableFooter, } from "@/shared/components/ui/table"
import type { GetQuotationOutput } from "zs-crm-common";

const QuotationWorkingDetails = ({ data }: { data: GetQuotationOutput }) => {

    const calculatePerKg = (data: GetQuotationOutput) => {
        const marketTotal = data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].market_total_cost, 0)
        const grandTotal = data.sub_total;
        const totalLabourCost = data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].labour_cost * p.quotation_working[0].set, 0);
        const totalMaterial = data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].ss_material + p.quotation_working[0].trolley_material, 0);
        const perKg = ((grandTotal - marketTotal) + totalLabourCost) / totalMaterial
        return perKg.toFixed(2)
    }

    return <>
        {data.quotation_products.length <= 1 ?
            <>
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
                                                <TableCell className="border-r">{working.labour_cost}</TableCell>
                                                <TableCell className="border-r">{working.set}</TableCell>
                                                <TableCell className="border-r">{Number(working.labour_cost) * Number(working.set)}</TableCell>
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
                                                <TableCell className="border-r">{working.powder_coating}</TableCell>
                                                <TableCell className="border-r">{working.set}</TableCell>
                                                <TableCell className="border-r">{Number(working.powder_coating) * Number(working.set)}</TableCell>
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
                                <Table className="border-2 border-black">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Per KG</TableHead>
                                            <TableHead>{calculatePerKg(data)}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </CardContent>
                        </Card>
                    )
                })}
            </> :
            <Card className="bg-background shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Quotation Working of - {data.quotation_no}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
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
                            {data.quotation_products.map((product, index) => {
                                return (
                                    <TableRow key={product.id} >
                                        <TableCell>{String.fromCharCode(65 + index)}</TableCell>
                                        <TableCell>{product.quotation_working[0].labour_cost}</TableCell>
                                        <TableCell>{product.quotation_working[0].ss_material}</TableCell>
                                        <TableCell>{product.quotation_working[0].trolley_material}</TableCell>
                                        <TableCell>{product.quotation_working[0].ss_material + product.quotation_working[0].trolley_material}</TableCell>
                                        <TableCell>{product.quotation_working[0].total_weight}</TableCell>
                                        <TableCell>{product.quotation_working[0].powder_coating}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="font-bold">
                                <TableCell>Total</TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].labour_cost, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].ss_material, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].trolley_material, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + (p.quotation_working[0].ss_material + p.quotation_working[0].trolley_material), 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].total_weight, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].powder_coating, 0)}
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
                            {data.quotation_products.map((product, index) => {
                                return (
                                    <TableRow key={product.id} >
                                        <TableCell>{String.fromCharCode(65 + index)}</TableCell>
                                        <TableCell>{product.quotation_working[0].installation}</TableCell>
                                        <TableCell>{product.quotation_working[0].installation * product.quotation_working[0].set * product.quotation_working[0].total_body}</TableCell>
                                        <TableCell>{product.quotation_working[0].accomodation}</TableCell>
                                        <TableCell>{product.quotation_working[0].transport}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow className="font-bold">
                                <TableCell colSpan={2}>Total</TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].installation * p.quotation_working[0].total_body, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].accomodation, 0)}
                                </TableCell>
                                <TableCell>
                                    {data.quotation_products.reduce((sum, p) => sum + p.quotation_working[0].transport, 0)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                    {data.quotation_products.map(product => {
                        const items = product.quotation_item
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
                    <Table className="border-2 border-black">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Per KG</TableHead>
                                <TableHead>{calculatePerKg(data)}</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </CardContent>
            </Card>
        }
    </>
}

export default QuotationWorkingDetails
