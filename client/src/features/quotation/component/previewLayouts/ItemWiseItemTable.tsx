import { useQuotation } from "@/context/QuotationContext"
import { TableBody, TableCell, TableRow, } from "@/shared/components/ui/table"
import { calculatePreviewMultiProductTotals, calculatePreviewProductTotal } from "../../utils/calculateTotal";

const ItemWiseItemTable = ({ isDiscountGiven }: { isDiscountGiven: boolean }) => {

    const { products, getProductItems } = useQuotation();
    let nonCompactorIndex = 1;

    return (
        <>
            {products.map((product, index: number) => {
                const items = getProductItems(product.id);
                const isCompactor = product.name.startsWith("Compactor");
                return (
                    <TableBody key={product.id}>
                        {products.length > 1 &&
                            <TableRow>
                                <TableCell className="border border-black font-bold bg-gray-100 text-center">
                                    {isCompactor ? String.fromCharCode(65 + index) : nonCompactorIndex++}
                                </TableCell>
                                <TableCell colSpan={isDiscountGiven ? 6 : 4} className="border border-black font-bold bg-gray-100 text-center">
                                    {product.name}
                                </TableCell>
                            </TableRow>
                        }
                        {items.map((item, index: number) => {
                            const compartment = product.name[18];
                            const { itemWiseProfit } = products.length == 1 ? calculatePreviewProductTotal(product, item) : calculatePreviewMultiProductTotals(products, item, product);
                            const discountRate = Number(itemWiseProfit.toFixed(2)) * (1 - product.discount / 100);
                            return (
                                <TableRow key={item.id} className="align-top">
                                    <TableCell className="border border-black text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-black max-w-sm break-words whitespace-normal font-semibold">
                                        <div>
                                            {item.name}{" "}
                                            {item.code ? `(${item.code})` : ""}{" "}
                                        </div>
                                        <div className="text-xs text-muted-foreground whitespace-pre-line">
                                            {isCompactor ? (
                                                <>
                                                    {item.name !== "DOOR" && (
                                                        <>
                                                            {`${item.height} (HT) x ${item.width} (W) x ${item.depth} (D) MM`}{" "}
                                                            {compartment ? `${compartment} Compartments` : ""}
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                item.description
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="border border-black text-center">
                                        {item.quantity}
                                    </TableCell >
                                    <TableCell className="border border-black text-center">
                                        {itemWiseProfit.toFixed(2)}
                                    </TableCell>
                                    {isDiscountGiven &&
                                        <>
                                            <TableCell className="border border-black text-center">
                                                {product.discount} %
                                            </TableCell >
                                            <TableCell className="border border-black text-center">
                                                {discountRate.toFixed(2)}
                                            </TableCell>
                                        </>
                                    }
                                    <TableCell className="border border-black text-center">
                                        {(item.quantity * discountRate).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                )
            })}
        </>
    )
}

export default ItemWiseItemTable