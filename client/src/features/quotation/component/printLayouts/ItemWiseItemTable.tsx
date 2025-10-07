import { type Dispatch, type SetStateAction } from "react"
import {  TableBody, TableCell,  TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import type { GetQuotationOutput } from "zs-crm-common"
import { calculatePrintMultiProductTotals, calculatePrintProductTotal } from "../../utils/calculateTotal"

const ItemWiseItemTable = ({ quotation, name, setName, isDiscountGiven }: { quotation: GetQuotationOutput, name: string[], setName: Dispatch<SetStateAction<string[]>>, isDiscountGiven: boolean }) => {

    return <>
        {
            quotation.quotation_products.map((product, index: number) => {
                return (
                    <TableBody key={product.id}>
                        {quotation.quotation_products && quotation.quotation_products.length > 1 &&
                            <TableRow>
                                <TableCell className="border border-black font-bold bg-gray-100 text-center">{String.fromCharCode(65 + index)}</TableCell>
                                <TableCell colSpan={isDiscountGiven ? 6: 4} className="border border-black font-bold bg-gray-100 text-center">
                                    <Input
                                        value={name[index] ?? ""}
                                        onChange={(e) =>
                                            setName((prev) =>
                                                prev.map((val, i) => (i === index ? e.target.value : val))
                                            )
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        }
                        {product.quotation_item.map((item, index: number) => {
                            const compartment = product.name[6];
                            const { itemWiseProfit } = quotation.quotation_products.length == 1 ? calculatePrintProductTotal(product, item) : calculatePrintMultiProductTotals(quotation.quotation_products, item, product);
                            const discountRate = (1 - product.quotation_working[0].discount / 100) * Number(itemWiseProfit.toFixed(2));
                            return (
                                <TableRow key={item.id} className="align-top">
                                    <TableCell className="border border-black text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="border border-black max-w-sm whitespace-normal break-words font-semibold">
                                        <div>
                                            {item.item_name}{" "}
                                            {item.item_code ? `(${item.item_code})` : ""}{" "}
                                        </div>
                                        <div className="text-xs text-muted-foreground whitespace-pre-line">
                                            {product.name.startsWith("Compactor") ? (
                                                <>
                                                    {item.item_name !== "DOOR" && (
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
                                                {product.quotation_working[0].discount.toFixed(2)}
                                            </TableCell>
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
            })
        }
    </>
}

export default ItemWiseItemTable