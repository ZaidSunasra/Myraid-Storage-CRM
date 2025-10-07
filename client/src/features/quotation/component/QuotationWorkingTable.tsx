import { useQuotation } from "@/context/QuotationContext"
import { Input } from "@/shared/components/ui/input"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"

const QuotationWorkingTable = ({ productId }: { productId: number }) => {
    
    const { getProductItems, updateItem,  getProductTotals} = useQuotation()

    const items = getProductItems(productId)
    const { totalMarketRate, totalProvidedRate } = getProductTotals(productId)

    return <Table className="border mb-6">
        <TableHeader>
            <TableRow>
                <TableHead colSpan={2} className="text-center border max-w-md">Name</TableHead>
                <TableHead colSpan={2} className="text-center border">Provided Rate</TableHead>
                <TableHead colSpan={2} className="text-center border">Market Rate</TableHead>
            </TableRow>
            <TableRow>
                <TableHead className="min-w-[200px] text-center border">Name</TableHead>
                <TableHead className="min-w-[100px] text-center border">Quantity</TableHead>
                <TableHead className="min-w-[100px] text-center border">Rate</TableHead>
                <TableHead className="min-w-[100px] text-center border">Total</TableHead>
                <TableHead className="min-w-[100px] text-center border">Rate</TableHead>
                <TableHead className="min-w-[100px] text-center border">Total</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="max-w-md break-words whitespace-normal">{item.name}</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={e =>
                                updateItem(productId, item.id, {
                                    quantity: Number(e.target.value)
                                })
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={item.provided_rate}
                            onChange={e =>
                                updateItem(productId, item.id, {
                                    provided_rate: Number(e.target.value)
                                })
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={item.quantity * item.provided_rate}
                            disabled
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={item.market_rate}
                            onChange={e =>
                                updateItem(productId, item.id, {
                                    market_rate: Number(e.target.value)
                                })
                            }
                        />
                    </TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={item.quantity * item.market_rate}
                            disabled
                        />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2} className="text-center">Total</TableCell>
                <TableCell colSpan={2} className="text-end pr-3">{totalProvidedRate}</TableCell>
                <TableCell colSpan={2} className="text-end pr-3">{totalMarketRate}</TableCell>
            </TableRow>
        </TableFooter>
    </Table>
}

export default QuotationWorkingTable