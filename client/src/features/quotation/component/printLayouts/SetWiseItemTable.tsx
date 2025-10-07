import { type Dispatch, type SetStateAction } from "react"
import { TableBody, TableCell, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { type GetQuotationOutput } from "zs-crm-common"
import { calculatePrintMultiProductTotals, calculatePrintProductTotal } from "../../utils/calculateTotal"

const SetWiseItemTable = ({ quotation, name, setName, isDiscountGiven }: { quotation: GetQuotationOutput, name: string[], setName: Dispatch<SetStateAction<string[]>>, isDiscountGiven: boolean }) => {

    return <>
        {
            quotation.quotation_products.map((product, index: number) => {
                return (
                    <TableBody key={product.id}>
                        {quotation?.quotation_products && quotation?.quotation_products.length > 1 &&
                            <TableRow>
                                <TableCell className="border border-black font-bold bg-gray-100 text-center">{String.fromCharCode(65 + index)}</TableCell>
                                <TableCell colSpan={isDiscountGiven ? 6 : 4} className="border border-black font-bold bg-gray-100 text-center">
                                    <Input
                                        className="print:hidden"
                                        value={name[index] ?? ""}
                                        onChange={(e) =>
                                            setName((prev) =>
                                                prev.map((val, i) => (i === index ? e.target.value : val))
                                            )
                                        }
                                    />
                                    <span className="print:inline hidden font-bold">{name[index]}</span>
                                </TableCell>
                            </TableRow>
                        }
                        {product.quotation_item.map((item, index: number) => {
                            const compartment = product.name[6];
                            const { setWiseProfit } = quotation.quotation_products.length == 1 ? calculatePrintProductTotal(product, item) : calculatePrintMultiProductTotals(quotation.quotation_products, item, product);
                            const discountRate = Number(((1 - product.quotation_working[0].discount / 100) * Number(setWiseProfit.toFixed(2))).toFixed(2));
                            return (
                                <TableRow key={item.id} className="align-top">
                                    <TableCell className="border border-black text-center border-t-0">
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
                                    {index === 0 &&
                                        <>
                                            <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                                {product.quotation_working[0].set} SET
                                            </TableCell>
                                            <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                                {setWiseProfit.toFixed(2)}
                                            </TableCell>
                                            {isDiscountGiven &&
                                                <>
                                                    <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center">
                                                        {product.quotation_working[0].discount}
                                                    </TableCell>
                                                    <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center">
                                                        {discountRate.toFixed(2)}
                                                    </TableCell>
                                                </>
                                            }
                                            <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                                {(discountRate * product.quotation_working[0].set).toFixed(2)}
                                            </TableCell>
                                        </>
                                    }
                                </TableRow>
                            )
                        })}
                    </TableBody>
                )
            })
        }
    </>
}

export default SetWiseItemTable