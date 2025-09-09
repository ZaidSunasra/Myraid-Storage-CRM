import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { useQuotation } from "@/context/QuotationContext"
import { Trash2 } from "lucide-react"

export default function QuotationTable() {
    const { items, updateItem, removeItem } = useQuotation()

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[100px]">Code</TableHead>
                    <TableHead className="min-w-[100px]">Height</TableHead>
                    <TableHead className="min-w-[100px]">Width</TableHead>
                    <TableHead className="min-w-[100px]">Depth</TableHead>
                    <TableHead className="min-w-[100px]">Quantity</TableHead>
                    <TableHead> Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map(item => (
                    <TableRow key={item.id}>
                        <TableCell className="whitespace-normal break-words">{item.name}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={item.default_height}
                                onChange={e =>
                                    updateItem(item.id, { default_height: Number(e.target.value) })
                                }
                            />
                        </TableCell>
                        <TableCell >
                            <Input
                                type="number"
                                value={item.default_width}
                                onChange={e =>
                                    updateItem(item.id, { default_width: Number(e.target.value) })
                                }
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                value={item.default_depth}
                                onChange={e =>
                                    updateItem(item.id, { default_depth: Number(e.target.value) })
                                }
                            />
                        </TableCell>
                        <TableCell>
                            <Input
                                type="number"
                                min={1}
                                value={item.qty}
                                onChange={e =>
                                    updateItem(item.id, { qty: Number(e.target.value) })
                                }
                            />
                        </TableCell>
                        <TableCell>
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
