import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { useQuotation } from "@/context/QuotationContext"
import { Plus, Trash2, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card"
import { Textarea } from "@/shared/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { FetchCompactorDetails } from "@/api/quotations/quotation.queries"
import { Skeleton } from "@/shared/components/ui/skeleton"

const QuotationProducts = ({ handleNext }: { handleNext: () => void }) => {

  const { products, updateItem, softDeleteItem, restoreItem, removeProduct, addItem } = useQuotation();
  const { data, isPending } = FetchCompactorDetails();

  if(isPending) return <Skeleton className="w-full h-96" />

  return <Card>
    <CardContent>
      {products.length > 0 &&
        <div className="space-y-8">
          {products.map((product) => {
            const isCompactor = product.name.toLowerCase().includes("compactor");
            return (
              <div key={product.id} className="border rounded-lg shadow-sm p-4">
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold mb-4">{product.name}</h2>
                  <div className="flex flex-row gap-8">
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => addItem(product.id)}
                    >
                      <Plus size={18} />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[300px] max-w-[400px]">Name</TableHead>
                      {!isCompactor &&
                        <TableHead className="min-w-[300px] max-w-[400px]"> Description </TableHead>
                      }
                      {isCompactor &&
                        <>
                          <TableHead className="min-w-[100px]">Code</TableHead>
                          <TableHead className="min-w-[100px]">Height</TableHead>
                          <TableHead className="min-w-[100px]">Width</TableHead>
                          <TableHead className="min-w-[100px]">Depth</TableHead>
                        </>
                      }
                      <TableHead className="min-w-[100px] max-w-[150px]">Quantity</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className={item.removed ? "bg-red-100/70 hover:bg-red-200 transition-colors" : "hover:bg-gray-50 transition-colors"}
                      >
                        <TableCell className="whitespace-normal break-words min-w-[300px] max-w-[400px]">
                          {!isCompactor &&
                            <Input
                              value={item.name}
                              onChange={(e) =>
                                updateItem(product.id, item.id, { name: e.target.value })
                              }
                              placeholder="Enter product name"
                            />
                          }
                          {isCompactor &&
                            <Select
                              disabled={isPending}
                              value={item.name}
                              onValueChange={(value) => {
                                const selected = data?.compactors.find((opt) => opt.name === value);
                                updateItem(product.id, item.id, {
                                  name: selected?.name ?? "",
                                  code: selected?.code ?? "",
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Compactor" />
                              </SelectTrigger>
                              <SelectContent className="w-full">
                                {data?.compactors.map((opt) => (
                                  <SelectItem key={opt.name} value={opt.name}>
                                    {opt.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          }
                        </TableCell>
                        {!isCompactor &&
                          <TableCell className="min-w-[300px] max-w-[400px]">
                            <Textarea
                              rows={3}
                              value={item.description ?? ""}
                              onChange={(e) =>
                                updateItem(product.id, item.id, { description: e.target.value })
                              }
                              placeholder="Enter item description"
                            />
                          </TableCell>
                        }
                        {isCompactor &&
                          <>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.height}
                                onChange={(e) =>
                                  updateItem(product.id, item.id, { height: Number(e.target.value) })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.width}
                                onChange={(e) =>
                                  updateItem(product.id, item.id, { width: Number(e.target.value) })
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.depth}
                                onChange={(e) =>
                                  updateItem(product.id, item.id, { depth: Number(e.target.value) })
                                }
                              />
                            </TableCell>
                          </>
                        }
                        <TableCell className="max-w-[150px]">
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(product.id, item.id, { quantity: Number(e.target.value) })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {item.removed ? (
                            <Button
                              className="bg-green-500 text-white hover:bg-green-600 transition-colors p-2 rounded-full"
                              onClick={() => restoreItem(product.id, item.id)}
                              title="Restore Item"
                              type="button"
                            >
                              <Plus size={18} />
                            </Button>
                          ) : (
                            <Button
                              className="bg-red-500 text-white hover:bg-red-600 transition-colors p-2 rounded-full"
                              onClick={() => softDeleteItem(product.id, item.id)}
                              title="Soft Delete Item"
                              type="button"
                            >
                              <X size={18} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          })}
        </div>
      }
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button onClick={handleNext} disabled={products.length <= 0}>
        Next
      </Button>
    </CardFooter>
  </Card>
}

export default QuotationProducts
