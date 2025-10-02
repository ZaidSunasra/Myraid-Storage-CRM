import { useQuotation } from "@/context/QuotationContext"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "@/shared/components/ui/table"
import React from "react";
import type { AddQuotation, QuotationItem, QuotationProduct } from "zs-crm-common";

const PreviewQuotationPage = ({ data }: { data: AddQuotation }) => {

  const { products, overallTotal, getProductItems } = useQuotation();

  const calculateProductTotal = (product: QuotationProduct, item?: QuotationItem) => {
    const extraExpense = Number(product.installation) * Number(product.total_body) + Number(product.accomodation) + Number(product.transport);
    const perBodyExpense = extraExpense / Number(product.total_body);
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = product.profit_percent / 100;
    const itemWiseProfit = itemWisetotal * (1 + profitPercent);
    const setWiseTotal = Number(product.total_provided_rate) + extraExpense;
    const setWiseProfit = setWiseTotal * (1 + profitPercent);
    return { setWiseTotal, setWiseProfit, itemWiseProfit, profitPercent };
  }

  const isDiscountGiven = products.some(
    (product) => (product.discount) > 0
  );
  //console.log(isDiscountGiven)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
      <div className="space-y-6 sm:col-span-3">
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
              {isDiscountGiven &&
                <>
                  <TableHead className="border border-black text-center">
                    Discount
                  </TableHead>
                  <TableHead className="border border-black text-center">
                    Disc. Rate
                  </TableHead>
                </>
              }
              <TableHead className="border border-black text-center">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          {data.quotation_template === "item_wise" ?
            <>
              {products.map((product) => {
                const items = getProductItems(product.id)
                return (
                  <TableBody key={product.id}>
                    {items.map((item, index: number) => {
                      const compartment = product.name[6];
                      const { itemWiseProfit } = calculateProductTotal(product, item)
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
                            {itemWiseProfit.toFixed(2)}
                          </TableCell>
                          {isDiscountGiven &&
                            <>
                              <TableCell className="border border-black text-center">
                                {product.discount} %
                              </TableCell >
                              <TableCell className="border border-black text-center">
                                {Number(itemWiseProfit.toFixed(2)) * (1 - product.discount / 100)}
                              </TableCell>
                            </>
                          }
                          <TableCell className="border border-black text-center">
                            {Number(item.quantity) * Number(itemWiseProfit.toFixed(2)) * (1 - product.discount / 100)}
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
                const items = getProductItems(product.id)
                return (
                  <TableBody key={product.id}>
                    {items.map((item, index: number) => {
                      const compartment = product.name[6];
                      const { setWiseProfit } = calculateProductTotal(product, item)
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
                                    {Number(setWiseProfit.toFixed(2)) * (1 - product.discount / 100)}
                                  </TableCell>
                                </>
                              }
                              <TableCell rowSpan={product.items.length} className="border border-black text-center">
                                {Number(setWiseProfit.toFixed(2)) * (1 - product.discount / 100) * Number(product.set)}
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
              <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">Total</TableCell>
              <TableCell>{overallTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">GST {data.gst}%</TableCell>
              <TableCell>{(Number(overallTotal) * data.gst / 100).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-r border-black">Round Off</TableCell>
              <TableCell>{data.round_off}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={isDiscountGiven ? 4 : 2} className="border-2 border-black border-r-0">Grand Total</TableCell>
              <TableCell className="border-2 border-black border-l-0">{data.grandTotal}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {products.map((product) => {
          const items = getProductItems(product.id)
          return (
            <Table key={product.id}>
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
                {items.map((item, index: number) => (
                  <React.Fragment key={item.id}>
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
                  </React.Fragment>
                ))
                }
              </TableBody>
              <TableFooter>
                <TableRow className="border-white">
                  <TableCell colSpan={2} className="bg-background"></TableCell>
                  <TableCell colSpan={2} className="border border-black">Total Body</TableCell>
                  <TableCell className="border border-black">{product.total_body}</TableCell>
                </TableRow>
                {data.quotation_template === "set_wise" &&
                  <TableRow>
                    <TableCell colSpan={2} className="bg-background"></TableCell>
                    <TableCell className="border border-black border-r-0">Set</TableCell>
                    <TableCell className="border border-black border-l-0">{product.set}</TableCell>
                    <TableCell className="border border-black">{product.total_body * product.set}</TableCell>
                  </TableRow>
                }
              </TableFooter>
            </Table>
          )
        })}
      </div>
      <div className="space-y-6 sm:col-span-2">
        {products.map((product) => {
          const { setWiseTotal, setWiseProfit, profitPercent } = calculateProductTotal(product)
          const items = getProductItems(product.id)
          return (
            <React.Fragment key={product.id}>
              <Table className="border border-black">
                <TableBody>
                  <TableRow>
                    <TableCell className="border border-black">Labour Cost</TableCell>
                    <TableCell className="border border-black">{product.labour_cost}</TableCell>
                    <TableCell className="border border-black">{product.set}</TableCell>
                    <TableCell className="border border-black">{Number(product.labour_cost) * Number(product.set)}</TableCell>
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
                    <TableCell className="border border-black">{product.powder_coating}</TableCell>
                    <TableCell className="border border-black">{product.set}</TableCell>
                    <TableCell className="border border-black">{Number(product.powder_coating) * Number(product.set)}</TableCell>
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
                  {items.map((item) => (
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
                    <TableCell className="border border-black"> {setWiseTotal} </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="border border-black">Profit (%)</TableCell>
                    <TableCell className="border border-black">{product.profit_percent}</TableCell>
                    <TableCell className="border border-black">{(profitPercent * setWiseTotal).toFixed(2)}</TableCell>
                  </TableRow>
                  {isDiscountGiven && 
                  <TableRow>
                    <TableCell className="border border-black">Discount (%)</TableCell>
                    <TableCell className="border border-black">{product.discount}</TableCell>
                    <TableCell className="border border-black">{product.discount / 100 * (1 + profitPercent) * setWiseTotal}</TableCell>
                    </TableRow>}
                  <TableRow>
                    <TableCell className="border border-black">Set</TableCell>
                    <TableCell className="border border-black">{product.set}</TableCell>
                    <TableCell className="border border-black">{Number(setWiseProfit.toFixed(2)) * Number(product.set) * Number(1 - product.discount / 100)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default PreviewQuotationPage