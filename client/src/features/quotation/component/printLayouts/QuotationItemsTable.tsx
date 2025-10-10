import { useState, type Dispatch, type SetStateAction } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import SetWiseItemTable from "./SetWiseItemTable"
import ItemWiseItemTable from "./ItemWiseItemTable"
import type { GetQuotationOutput } from "zs-crm-common"
import { Button } from "@/shared/components/ui/button"

const QuotationItemsTable = ({ quotation, name, setName }: { quotation: GetQuotationOutput, name: string[], setName: Dispatch<SetStateAction<string[]>> }) => {

    const [specs, setSpecs] = useState([
        "2 TRACK",
        "0.8 MM THICKNESS SUPERSTRUCTURE",
        "2.5 MM TROLLY",
        "POWDER COATED",
        "HSN CODE: 9403",
        "All dimensions are in MM",
        "Mild Steel",
        "Body 0.6 and Door 0,7 Thickness",
        "Powder Coated with Epoxy Polyester"
    ]);

    const rowsToPrint = specs.length - 4;

    const isDiscountGiven = quotation.quotation_products.some(
        (product) => (product.quotation_working[0].discount) > 0
    );

    return (
        <>
            <Table className="mb-4 border border-black">
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center border border-black">Sr. No</TableHead>
                        <TableHead className="text-center border border-black max-w-sm">Description of Goods</TableHead>
                        <TableHead className="text-center border border-black">Quantity</TableHead>
                        <TableHead className="text-center border border-black">Rate</TableHead>
                        {isDiscountGiven &&
                            <>
                                <TableHead className="text-center border border-black">Discount</TableHead>
                                <TableHead className="text-center border border-black">Dis. Rate</TableHead>
                            </>
                        }
                        <TableHead className="text-center border border-black">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                {quotation.quotation_template === "set_wise" ?
                    <SetWiseItemTable quotation={quotation} name={name} setName={setName} isDiscountGiven={isDiscountGiven} />
                    : <ItemWiseItemTable quotation={quotation} name={name} setName={setName} isDiscountGiven={isDiscountGiven} />
                }
                <TableBody>
                    <TableRow>
                        <TableCell className="border-r border-black"></TableCell>
                        <TableCell className="border-r border-black">
                            <span className="text-red-600 font-bold">{specs[0]}</span>
                        </TableCell>
                        <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border border-black text-center">Total</TableCell>
                        <TableCell className="border border-black text-center">{quotation.sub_total}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="border-r border-black"></TableCell>
                        <TableCell className="border-r border-black">
                            <span className="text-red-600 font-bold">{specs[1]}</span>
                        </TableCell>
                        <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border border-black text-center">GST {quotation.gst}%</TableCell>
                        <TableCell className="border border-black text-center">{(quotation.sub_total * quotation.gst / 100).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="border-r border-black"></TableCell>
                        <TableCell className="border-r border-black">
                            <span className="text-red-600 font-bold">{specs[2]}</span>
                        </TableCell>
                        <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border border-black text-center">Round Off</TableCell>
                        <TableCell className="border border-black text-center">{quotation.round_off}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="border-r border-black"></TableCell>
                        <TableCell className="border-r border-black">
                            <span className="text-red-600 font-bold">{specs[3]}</span>
                        </TableCell>
                        <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border border-black text-center">Grand Total</TableCell>
                        <TableCell className="border border-black text-center">{quotation.grand_total}</TableCell>
                    </TableRow>
                    {rowsToPrint > 0 &&
                        Array.from({ length: rowsToPrint }).map((_, index) => (
                            <TableRow key={index}>
                                <TableCell className="border-r border-black"></TableCell>
                                <TableCell className="border-r border-black" colSpan={isDiscountGiven ? 5 : 4}>
                                    <span className="text-red-600 font-bold"> {specs[index + 4]} </span>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {quotation.note &&
                <Card>
                    <CardContent className="text-red-600 font-bold">
                        Note: {quotation.note}
                    </CardContent>
                </Card>
            }
            <Card className="print:hidden mb-6 mt-6">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Specifications</span>
                        <Button
                            type="button"
                            variant="default"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => setSpecs((prev) => [...prev, ""])}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Spec
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <Input
                                value={spec}
                                onChange={(e) =>
                                    setSpecs((prev) =>
                                        prev.map((val, i) => (i === index ? e.target.value : val))
                                    )
                                }
                            />
                            <Button
                                type="button"
                                size="icon"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={() =>
                                    setSpecs((prev) => prev.filter((_, i) => i !== index))
                                }
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}

export default QuotationItemsTable