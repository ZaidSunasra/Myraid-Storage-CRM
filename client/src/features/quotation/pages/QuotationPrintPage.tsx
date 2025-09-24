import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/shared/components/ui/button"
import { FetchQuotationById } from "@/api/quotations/quotation.queries"
import { useParams } from "react-router"
import { Skeleton } from "@/shared/components/ui/skeleton"
import ErrorDisplay from "@/shared/components/ErrorPage"
import Logo from "@/assets/logo.png"
import { format } from "date-fns"
import { capitalize } from "@/utils/formatData"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"

const QuotationPrint = () => {

  const { quotation_id, id } = useParams();
  const { data, isPending, isError } = FetchQuotationById(quotation_id as string);
  const printRef = useRef<HTMLDivElement>(null)

  const [specs, setSpecs] = useState([
    "2 TRACK",
    "0.8 MM THICKNESS SUPERSTRUCTURE",
    "2.5 MM TROLLY",
    "POWDER COATED",
    "HSN CODE: 9403"
  ]);

  const defaultTerms = `1. Payment :- 50% Advance payment along with the purchase order, 50% payment before material dispatching.\n2. Delivery :- Order of material delivery within 4 to 5 weeks from the date of receipt of this P.O.\n3. Unloading Material :- At your scope (any mathadi union unloading issue to be managed by buyer & it will not be our responsibility).\n4. Packing Charges :- No extra charges for packing of material.\n5. Colour :- RAL 7032 STR, RAL 7035 STR, LIGHT GREY STR, D.A.GREY STR or AVAILABLE SHADES.\n6. Quotation Validity :- 15 days.\n7. Taxes :- Within Maharashtra 9% CGST + 9% SGST / outside Maharashtra 18% IGST Extra to your Account.\n8. Freight Charges :- At your scope.\n9. Installation Charges :- At your end.\n10. Loading and Boarding :- At your scope.\n11. Warranty :- 12 months Warranty against Manufacturing defect.\n12. Annual Maintenance Contract from "MYRIAD" will start after completion of 1 year’s Warranty. Till 1 year, any kind of servicing will be done free to client.\n
  `;
  const [terms, setTerms] = useState(defaultTerms);

  const calculateProductTotal = (product: any, item?: any) => {
    const productTotal = Number(product.quotation_working[0].provided_total_cost) + Number(product.quotation_working[0].installation) * Number(product.quotation_working[0].total_body) + Number(product.quotation_working[0].transport) + Number(product.quotation_working[0].accomodation);
    const profitTotal = Number(Number(productTotal) * (1 + (Number(product.quotation_working[0].profit_percent) / 100))).toFixed(2);
    const doorItem = product.quotation_item.find((item: any) => item.name === "DOOR");
    const doorTotal = doorItem ? doorItem.provided_rate : 0;
    const qtyRatio = Number(item?.per_bay_qty) / Number(product.quotation_working[0].total_body);
    const itemWiseTotal = ((Number(profitTotal) - doorTotal) * qtyRatio).toFixed(2);
    return { productTotal, profitTotal, doorTotal, itemWiseTotal };
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Quotation ${id}`
  })

  if (isPending) return <Skeleton className="h-screen w-screen bg-accent" />
  if (isError) return <ErrorDisplay fullPage />
  console.log(data)

  return (
    <div>
      <div className="m-6 flex justify-end gap-4">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
          Print
        </Button>
      </div>
      <div ref={printRef} className="relative p-2">
        <div>
          <div className="flex mb-4 gap-1 -m-2">
            <div>
              <img src={Logo} alt="logo" className="w-full" />
            </div>
            <div>
              <p>702A, AL-HUSSAIN, Momin Nagar, Jogeshwari (W)</p>
              <p>  MUMBAI 40102. State  :  Maharashtra, Code : 27</p>
              <p className="">Contact: 9769370343 </p>
              <p>GST No: 27ABJFM1234A1Z5</p>
              <p>info@myriadstoragesystem.com</p>
              <p>sales@myriadstoragesystem.com</p>
              <p>www.myriadstoragesystem.com</p>
            </div>
          </div>
          <hr />
          <p>Factory Address: Gala No 5, Vakan Compound, Near Dynamic Co, Vakan Pada Raod, Vasai Phata, Vasai East, Dis. Palghar 401208. </p>
        </div>
        <hr />
        <div className="mb-6 font-bold">
          <p>Quotation No: {id}</p>
          <p>Date: {format(data.quotation.created_at, "dd-MM-yyyy")}</p>
          <p>Buyer</p>
          <br />
          <br />
          <br />
          <p>Email: {data.quotation.deal.client_detail.emails.length > 0 ? data.quotation.deal.client_detail.emails[0].email : ""}</p>
          <p>Phone: {data.quotation.deal.client_detail.phones[0]?.phone}</p>
          <p>Kind Attach: Mr. {capitalize(data.quotation.deal.client_detail.first_name)} {capitalize(data.quotation.deal.client_detail.last_name)}</p>
        </div>
        <Table className="mb-4 border border-black">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <img src={Logo} alt="Watermark" />
          </div>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center border border-black">Sr. No</TableHead>
              <TableHead className="text-center border border-black">Description of Goods</TableHead>
              <TableHead className="text-center border border-black">Quantity</TableHead>
              <TableHead className="text-center border border-black">Rate</TableHead>
              <TableHead className="text-center border border-black">Amount</TableHead>
            </TableRow>
          </TableHeader>
          {data.quotation.quotation_template === "item_wise" ?
            <>
              {data.quotation.quotation_products.map((product: any) => {
                return (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="border border-black font-bold bg-gray-100 text-center">
                        {product.name}
                      </TableCell>
                    </TableRow>
                    {product.quotation_item.map((item: any, index: number) => {
                      const compartment = product.name[6];
                      const { itemWiseTotal } = calculateProductTotal(product, item)
                      return (
                        <TableRow key={item.id} className="align-top">
                          <TableCell className="border border-black text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-black">
                            <div className="font-semibold">
                              {item.item_name}{" "}
                              {item.item_code ? `(${item.item_code})` : ""}{" "}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {item.item_name !== "DOOR" ? `${item.height} (HT) x ${item.width} (W) x ${item.depth} (D) MM` : ""}{" "}
                              {item.item_name !== "DOOR" ? compartment ? `${compartment} Compartments` : "" : ""}
                            </div>
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {item.quantity}
                          </TableCell >
                          <TableCell className="border border-black text-center">
                            {item.item_name === "DOOR" ? `${item.provided_rate}` : `${itemWiseTotal}`}
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {item.item_name === "DOOR" ? `${Number(item.provided_rate) * Number(item.quantity)}` : `${Number(Number(item.quantity) * Number(itemWiseTotal)).toFixed(2)}`}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )
              })}
            </>
            : <>
              {data.quotation.quotation_products.map((product: any) => {
                return (
                  <TableBody key={product.id}>
                    <TableRow>
                      <TableCell colSpan={5} className="border border-black font-bold bg-gray-100 text-center">
                        {product.name}
                      </TableCell>
                    </TableRow>
                    {product.quotation_item.map((item: any, index: number) => {
                      const compartment = product.name[6];
                      const { profitTotal } = calculateProductTotal(product, item)
                      return (
                        <>
                          <TableRow key={item.id} className="align-top">
                            <TableCell className="border border-black text-center border-t-0">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border border-black border-t-0">
                              <div className="font-semibold">
                                {item.item_name}{" "}
                                {item.item_code ? `(${item.item_code})` : ""}{" "}
                                (QTY {item.quantity} Nos)
                              </div>
                              <div className="text-xs text-muted-foreground border-t-0">
                                {item.item_name !== "DOOR" ? `${item.height} (HT) x ${item.width} (W) x ${item.depth} (D) MM` : ""}{" "}
                                {item.item_name !== "DOOR" ? compartment ? `${compartment} Compartments` : "" : ""}
                              </div>
                            </TableCell>
                            {index === 0 &&
                              <>
                                <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                  {product.quotation_working[0].set} SET
                                </TableCell>
                                <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                  {profitTotal}
                                </TableCell>
                                <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                  {Number(profitTotal) * Number(product.quotation_working[0].set)}
                                </TableCell>
                              </>
                            }
                          </TableRow>
                        </>
                      )
                    })}
                  </TableBody>
                )
              })}
            </>
          }
          <TableBody>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <Input
                 className="print:hidden"
                  value={specs[0]}
                  onChange={(e) => {
                    const newSpecs = [...specs];
                    newSpecs[0] = e.target.value;
                    setSpecs(newSpecs);
                  }}
                />
                <span className="print:inline hidden text-red-600 font-bold">{specs[0]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Total</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.sub_total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <Input
                 className="print:hidden"
                  value={specs[1]}
                  onChange={(e) => {
                    const newSpecs = [...specs];
                    newSpecs[1] = e.target.value;
                    setSpecs(newSpecs);
                  }}
                />
                <span className="print:inline hidden text-red-600 font-bold">{specs[1]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center"></TableCell>
              <TableCell className="border border-black text-center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <Input
                  className="print:hidden"
                  value={specs[2]}
                  onChange={(e) => {
                    const newSpecs = [...specs];
                    newSpecs[2] = e.target.value;
                    setSpecs(newSpecs);
                  }}
                />
                <span className="print:inline hidden text-red-600 font-bold">{specs[2]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center"></TableCell>
              <TableCell className="border border-black text-center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <Input
                  className="print:hidden"
                  value={specs[3]}
                  onChange={(e) => {
                    const newSpecs = [...specs];
                    newSpecs[3] = e.target.value;
                    setSpecs(newSpecs);
                  }}
                />
                <span className="print:inline hidden text-red-600 font-bold">{specs[3]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">GST {data.quotation.gst}%</TableCell>
              <TableCell className="border border-black text-center">{(Number(data.quotation.sub_total) * (Number(data.quotation.gst) / 100)).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <Input
                  className="print:hidden"
                  value={specs[4]}
                  onChange={(e) => {
                    const newSpecs = [...specs];
                    newSpecs[4] = e.target.value;
                    setSpecs(newSpecs);
                  }}
                />
                <span className="print:inline hidden text-red-600 font-bold">{specs[4]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Round Off</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.round_off}</TableCell>
            </TableRow>
            {data.quotation.discount >= 0 &&
              <TableRow>
                <TableCell className="border-r border-black"></TableCell>
                <TableCell className="border-r border-black"></TableCell>
                <TableCell colSpan={2} className="border border-black text-center">Discount</TableCell>
                <TableCell className="border border-black text-center">{data.quotation.discount}</TableCell>
              </TableRow>
            }
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Grand Total</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.grand_total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mb-6 space-y-2">
          {data.quotation.quotation_products.map((product: any) => (
            <Table className="border border-black w-3/5">
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="border border-black">Sr. No</TableHead>
                  <TableHead colSpan={3} className="border border-black">Description of Goods</TableHead>
                  <TableHead rowSpan={2} className="border border-black">Installation Body</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="border border-black">Per Bay Qty</TableHead>
                  <TableHead className="border border-black">Qty</TableHead>
                  <TableHead className="border border-black">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.quotation_item.map((item: any, index: number) => (
                  <>
                    {item.item_name !== "DOOR" &&
                      <TableRow key={item.id}>
                        <TableCell className="border border-black">{index + 1}</TableCell>
                        <TableCell className="border border-black">
                          <div>  {item.item_code} {product.name[0]} Bay </div>
                          <div> Body in {item.item_code}</div>
                        </TableCell>
                        <TableCell className="border border-black">{item.per_bay_qty}</TableCell>
                        <TableCell className="border border-black">{item.quantity}</TableCell>
                        <TableCell className="border border-black">{Number(item.per_bay_qty) * Number(item.quantity)}</TableCell>
                      </TableRow>
                    }
                  </>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="border border-black"></TableCell>
                  <TableCell className="border border-black">Total</TableCell>
                  <TableCell className="border border-black"> {product.quotation_working[0].total_body}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          ))}
        </div>
        <h3 className="text-lg text-red-600 font-bold">
          Terms and Conditions
        </h3>
        <Textarea
          rows={12}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="w-full resize-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 print:hidden"
        />
        <div className="hidden print:block whitespace-pre-line text-sm text-gray-800">
          {terms}
        </div>
      </div>
    </div>
  )
}

export default QuotationPrint
