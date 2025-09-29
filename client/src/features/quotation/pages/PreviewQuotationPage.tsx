import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import type { AddQuotation, QuotationItem, QuotationProduct } from "zs-crm-common";

const PreviewQuotationPage = ({ data }: { data: AddQuotation }) => {

  const { products, overallTotal } = useQuotation();

  const calculateProductTotal = (product: QuotationProduct, item?: QuotationItem) => {
    const productTotal = Number(product.total_provided_rate) + Number(product.installation) * Number(product.total_body) + Number(product.transport) + Number(product.accomodation);
    const profitTotal = Number(Number(productTotal) * (1 + (Number(product.profit_percent) / 100))).toFixed(2);
    const doorItem = product.items.find((item) => item.name === "DOOR");
    const doorTotal = doorItem ? doorItem.provided_rate : 0;
    const qtyRatio = Number(item?.per_bay_qty) / Number(product.total_body);
    const itemWiseTotal = ((Number(profitTotal) - doorTotal) * qtyRatio).toFixed(2);
    return { productTotal, profitTotal, doorTotal, itemWiseTotal };
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-6">
        <Table className="border border-black">
          <TableHeader>
            <TableRow>
              <TableHead className="border border-black w-12 text-center">
                Sr. No
              </TableHead>
              <TableHead className="border border-black">
                Description of Goods
              </TableHead>
              <TableHead className="border border-black text-center">
                Qty
              </TableHead>
              <TableHead className="border border-black text-center">
                Rate
              </TableHead>
              <TableHead className="border border-black text-center">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          {data.quotation_template === "item_wise" ?
            <>
              {products.map((product) => {
                return (
                  <TableBody>
                    {product.items.map((item, index: number) => {
                      const compartment = product.name[6];
                      const { itemWiseTotal } = calculateProductTotal(product, item)
                      return (
                        <TableRow key={item.id} className="align-top">
                          <TableCell className="border border-black text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-black">
                            <div className="font-semibold">
                              {item.name}{" "}
                              {item.code ? `(${item.code})` : ""}{" "}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.name !== "DOOR" ? `${item.height} (HT) x ${item.width} (W) x ${item.depth} (D) MM` : ""}{" "}
                              {item.name !== "DOOR" ? compartment ? `${compartment} Compartments` : "" : ""}
                            </div>
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {item.quantity}
                          </TableCell >
                          <TableCell className="border border-black text-center">
                            {item.name === "DOOR" ? `${item.provided_rate}` : `${itemWiseTotal}`}
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {item.name === "DOOR" ? `${Number(item.provided_rate) * Number(item.quantity)}` : `${Number(Number(item.quantity) * Number(itemWiseTotal)).toFixed(2)}`}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )
              })}
            </>
            : <>
              {products.map((product) => {
                return (
                  <TableBody>
                    {product.items.map((item, index: number) => {
                      const compartment = product.name[6];
                      const { profitTotal } = calculateProductTotal(product, item)
                      return (
                        <TableRow key={item.id} className="align-top">
                          <TableCell className="border border-black text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-black">
                            <div className="font-semibold">
                              {item.name}{" "}
                              {item.code ? `(${item.code})` : ""}{" "}
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
                                {profitTotal}
                              </TableCell>
                              <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                {Number(profitTotal) * Number(product.set)}
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
          }
          <TableFooter>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border-r border-black">Total</TableCell>
              <TableCell>{overallTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border-r border-black">GST {data.gst}%</TableCell>
              <TableCell>{(Number(overallTotal) *  Number(data.gst) / 100).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border-r border-black">Round Off</TableCell>
              <TableCell>{data.round_off}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border-r border-black">Discount</TableCell>
              <TableCell>{data.discount}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border-2 border-black border-r-0">Grand Total</TableCell>
              <TableCell className="border-2 border-black border-l-0">{data.grandTotal}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {products.map((product) => (
          <Table className="border border-black" key={product.id}>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="border border-black">Sr. No</TableHead>
                <TableHead colSpan={3} className="border border-black">Description of Goods</TableHead>
                <TableHead rowSpan={2} className="border border-black">Installation Body</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="border border-black">Name</TableHead>
                <TableHead className="border border-black">Per bay qty</TableHead>
                <TableHead className="border border-black"> Qty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                product.items.map((item, index: number) => (
                  <>
                    {
                      item.name !== "DOOR" &&
                      <TableRow key={item.id}>
                        <TableCell className="border border-black">{index + 1} </TableCell>
                        <TableCell className="border border-black">{item.name}</TableCell>
                        <TableCell className="border border-black">{item.per_bay_qty}</TableCell>
                        <TableCell className="border border-black">{item.quantity}</TableCell>
                        <TableCell className="border border-black">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                      </TableRow>
                    }
                  </>
                ))
              }
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total Body</TableCell>
                <TableCell>{product.total_body}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ))}
      </div>
      <div className="space-y-6">
        {products.map((product) => {
          const { productTotal, profitTotal } = calculateProductTotal(product)
          return (
            <>
              <Table className="border border-black">
                <TableBody>
                  <TableRow>
                    <TableCell className="border border-black">Labour</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black">{product.labour_cost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Material</TableCell>
                    <TableCell className="border border-black">{product.ss_material}</TableCell>
                    <TableCell className="border border-black">{product.trolley_material}</TableCell>
                    <TableCell className="border border-black">{Number(product.ss_material) + Number(product.trolley_material)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Total Weight</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black">{product.total_weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Powder Coating</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black">{product.powder_coating}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table className="border border-black">
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
                  {product.items.map((item) => (
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
              <Table className="border border-black">
                <TableBody>
                  <TableRow>
                    <TableCell className="border border-black">Installation</TableCell>
                    <TableCell className="border border-black">{product.installation}</TableCell>
                    <TableCell className="border border-black">{Number(product.installation) * Number(product.total_body)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Accomodation</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black">{product.accomodation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Transport</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black">{product.transport}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table className="border border-black">
                <TableBody>
                  <TableRow>
                    <TableCell className="border border-black">Total</TableCell>
                    <TableCell className="border border-black"></TableCell>
                    <TableCell className="border border-black"> {productTotal} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Profit (%)</TableCell>
                    <TableCell className="border border-black">{product.profit_percent}</TableCell>
                    <TableCell className="border border-black">{Number(profitTotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Set</TableCell>
                    <TableCell className="border border-black">{product.set}</TableCell>
                    <TableCell className="border border-black">{Number(profitTotal) * Number(product.set)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )
        })}
      </div>
    </div>
  )
}

export default PreviewQuotationPage