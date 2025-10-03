import { useQuotation } from "@/context/QuotationContext"
import { TableBody, TableCell, TableRow, } from "@/shared/components/ui/table"
import { calculatePreviewMultiProductTotals, calculatePreviewProductTotal } from "../../utils/calculateTotal";

const SetWiseItemTable = ({ isDiscountGiven }: { isDiscountGiven: boolean }) => {

    const { products, getProductItems } = useQuotation();

    return (
        <>
            {products.map((product, index: number) => {
                const items = getProductItems(product.id)
                return (
                    <TableBody key={product.id}>
                        {products.length > 1 &&
                            <TableRow>
                                <TableCell className="border border-black font-bold bg-gray-100 text-center">{String.fromCharCode(65 + index)}</TableCell>
                                <TableCell colSpan={isDiscountGiven ? 6 : 4} className="border border-black font-bold bg-gray-100 text-center">
                                    {product.name}
                                </TableCell>
                            </TableRow>
                        }
                        {items.map((item, index: number) => {
                            const compartment = product.name[6];
                            const { setWiseProfit } = products.length == 1 ? calculatePreviewProductTotal(product, item) : calculatePreviewMultiProductTotals(products, item, product)
                            const discountRate = Number(setWiseProfit.toFixed(2)) * (1 - product.discount / 100);
                            return (
                                <TableRow key={item.id} className="align-top">
                                    <TableCell className="border border-black text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-black">
                                        <div className="font-semibold">
                                            {item.name}{" "}
                                            {item.code ? `(${item.code})` : ""}{" "}
                                            {item.name !== "DOOR" ? `(Qty ${item.quantity} Nos)` : `(${item.quantity} SET)`}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {item.name !== "DOOR" ? `${item.height} (HT) x ${item.width} (W) x ${item.depth} (D) MM` : ""}{" "}
                                            {item.name !== "DOOR" ? compartment ? `${compartment} Compartments` : "" : ""}
                                        </div>
                                    </TableCell>
                                    {index === 0 &&
                                        <>
                                            <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                                {product.set} SET
                                            </TableCell>
                                            <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                                {setWiseProfit.toFixed(2)}
                                            </TableCell>
                                            {isDiscountGiven &&
                                                <>
                                                    <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                                        {product.discount} %
                                                    </TableCell >
                                                    <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                                        {discountRate}
                                                    </TableCell>
                                                </>
                                            }
                                            <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                                {discountRate * Number(product.set)}
                                            </TableCell>
                                        </>
                                    }
                                </TableRow>
                            )
                        })}
                    </TableBody>
                )
            })}
        </>
    )
}

export default SetWiseItemTable