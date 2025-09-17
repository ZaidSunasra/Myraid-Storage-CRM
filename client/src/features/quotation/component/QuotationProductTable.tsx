import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { useQuotation } from "@/context/QuotationContext"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export default function QuotationTable() {
    const { products, updateItem, removeItem, removeProduct } = useQuotation()

    return (
        <div className="space-y-8">
            {products.map((product) => (
                <div key={product.id} className="border rounded-lg shadow-sm p-4">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-semibold mb-4">{product.name}</h2>
                        <Button
                            variant="destructive"
                            onClick={() => removeProduct(product.id)}
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[200px]">Name</TableHead>
                                <TableHead className="min-w-[100px]">Code</TableHead>
                                <TableHead className="min-w-[100px]">Height</TableHead>
                                <TableHead className="min-w-[100px]">Width</TableHead>
                                <TableHead className="min-w-[100px]">Depth</TableHead>
                                <TableHead className="min-w-[100px]">Quantity</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {product.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="whitespace-normal break-words">{item.name}</TableCell>
                                    <TableCell>{item.code}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.default_height}
                                            onChange={(e) =>
                                                updateItem(product.id, item.id, { default_height: Number(e.target.value) })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.default_width}
                                            onChange={(e) =>
                                                updateItem(product.id, item.id, { default_width: Number(e.target.value) })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.default_depth}
                                            onChange={(e) =>
                                                updateItem(product.id, item.id, { default_depth: Number(e.target.value) })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            onChange={(e) =>
                                                updateItem(product.id, item.id, { qty: Number(e.target.value) })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            onClick={() => removeItem(product.id, item.id)}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    )
}
