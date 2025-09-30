import React, { useEffect, useRef, useState } from "react"
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
import type { Quotation_Item, Quotation_Product } from "zs-crm-common"
import { Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

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
  const isDiscountAvailable = data?.quotation && data.quotation.discount > 0 ? true : false;
  const rowsToPrint = isDiscountAvailable ? specs.length - 6 : specs.length - 5;

  const [name, setName] = useState<string[]>([]);
  useEffect(() => {
    if (data?.quotation?.quotation_products && data?.quotation?.quotation_products.length > 0) {
      setName(data.quotation?.quotation_products.map(product => product.name))
    }
  }, [data]);

  const defaultTerms = `1. Payment :- 50% Advance payment along with the purchase order, 50% payment before material dispatching.\n2. Delivery :- Order of material delivery within 4 to 5 weeks from the date of receipt of this P.O.\n3. Unloading Material :- At your scope (any mathadi union unloading issue to be managed by buyer & it will not be our responsibility).\n4. Packing Charges :- No extra charges for packing of material.\n5. Colour :- RAL 7032 STR, RAL 7035 STR, LIGHT GREY STR, D.A.GREY STR or AVAILABLE SHADES.\n6. Quotation Validity :- 15 days.\n7. Taxes :- Within Maharashtra 9% CGST + 9% SGST / outside Maharashtra 18% IGST Extra to your Account.\n8. Freight Charges :- At your scope.\n9. Installation Charges :- At your end.\n10. Loading and Boarding :- At your scope.\n11. Warranty :- 12 months Warranty against Manufacturing defect.\n12. Annual Maintenance Contract from "MYRIAD" will start after completion of 1 year’s Warranty. Till 1 year, any kind of servicing will be done free to client.\n
  `;
  const [terms, setTerms] = useState(defaultTerms);

  const calculateProductTotal = (product: Quotation_Product, item?: Quotation_Item) => {
    const extraExpense = Number(product.quotation_working[0].installation) * Number(product.quotation_working[0].total_body) + Number(product.quotation_working[0].accomodation) + Number(product.quotation_working[0].transport);
    const perBodyExpense = extraExpense / Number(product.quotation_working[0].total_body);
    const itemWisetotal = Number(item?.provided_rate) + perBodyExpense * Number(item?.per_bay_qty);
    const profitPercent = 1 + product.quotation_working[0].profit_percent / 100;
    const itemWiseProfit = itemWisetotal * profitPercent;
    const setWiseTotal = Number(product.quotation_working[0].provided_total_cost) + extraExpense;
    const setWiseProfit = setWiseTotal * profitPercent;
    return { setWiseTotal, setWiseProfit, itemWiseProfit };
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Quotation ${id}`
  })

  if (isPending) return <Skeleton className="h-screen w-screen bg-accent" />
  if (isError) return <ErrorDisplay fullPage />
  if (!data.quotation) return null;

  return (
    <div>
      <div className="m-6 flex justify-end gap-4">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
          Print
        </Button>
      </div>
      <div ref={printRef} className="relative mt-2">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <img src={Logo} alt="Watermark" />
        </div>
        <div>
          <div className="flex mb-4 gap-1 -m-2">
            <div>
              <img src={Logo} alt="logo" className="w-full" />
            </div>
            <div>
              <p> A/702, Al Husain Bldg, Momin Nagar, Jogeshwari (W), Mumbai 400102 </p>
              <p>State  :  Maharashtra, Code : 27</p>
              <p>Contact: 9769370343 </p>
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
          {data.quotation.quotation_products.length == 1 &&
            <>
              <Input
                className="print:hidden"
                value={name[0] ?? ""}
                onChange={(e) =>
                  setName((prev) =>
                    prev.map((val, i) => (i === 0 ? e.target.value : val))
                  )
                }
              />
              {name[0] !== "" && <p> Drawing No: {name[0]} </p>}
            </>
          }
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
              {data.quotation.quotation_products.map((product, index: number) => {
                return (
                  <TableBody key={product.id}>
                    {data.quotation?.quotation_products && data.quotation?.quotation_products.length > 1 &&
                      <TableRow>
                        <TableCell colSpan={5} className="border border-black font-bold bg-gray-100 text-center">
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
                      const { itemWiseProfit } = calculateProductTotal(product, item)
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
                            {itemWiseProfit.toFixed(2)}
                          </TableCell>
                          <TableCell className="border border-black text-center">
                            {Number(item.quantity) * Number(itemWiseProfit.toFixed(2))}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                )
              })}
            </>
            : <>
              {data.quotation.quotation_products.map((product, index: number) => {
                return (
                  <TableBody key={product.id}>
                    {data.quotation?.quotation_products && data.quotation?.quotation_products.length > 1 &&
                      <TableRow>
                        <TableCell className="border border-black font-bold bg-gray-100 text-center">{String.fromCharCode(65 + index)}</TableCell>
                        <TableCell colSpan={4} className="border border-black font-bold bg-gray-100 text-center">
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
                      const { setWiseProfit } = calculateProductTotal(product, item)
                      return (
                        <React.Fragment key={item.id}>
                          <TableRow key={item.id} className="align-top">
                            <TableCell className="border border-black text-center border-t-0">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border border-black border-t-0">
                              <div className="font-semibold">
                                {item.item_name}{" "}
                                {item.item_code ? `(${item.item_code})` : ""}{" "}
                                {item.item_name !== "DOOR" ? `(Qty ${item.quantity} Nos)` : `(${item.quantity} SET)`}
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
                                  {setWiseProfit.toFixed(2)}
                                </TableCell>
                                <TableCell rowSpan={product.quotation_item.length} className="border border-black text-center border-t-0">
                                  {Number(setWiseProfit.toFixed(2)) * Number(product.quotation_working[0].set)}
                                </TableCell>
                              </>
                            }
                          </TableRow>
                        </React.Fragment>
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
              <TableCell className="border-r border-black"></TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Total</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.sub_total}</TableCell>
            </TableRow>
            {rowsToPrint > 0 &&
              Array.from({ length: rowsToPrint }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="border-r border-black"></TableCell>
                  <TableCell className="border-r border-black">
                    <span className="text-red-600 font-bold"> {specs[index]} </span>
                  </TableCell>
                  <TableCell colSpan={2} className="border border-black text-center"></TableCell>
                  <TableCell className="border border-black text-center"></TableCell>
                </TableRow>
              ))
            }
            <TableRow className="h-[36.8px]">
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <span className="text-red-600 font-bold">{isDiscountAvailable ? specs[specs.length - 6] : specs[specs.length - 5]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center"></TableCell>
              <TableCell className="border border-black text-center"></TableCell>
            </TableRow>
            <TableRow className="h-[36.8px]">
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <span className="text-red-600 font-bold">{isDiscountAvailable ? specs[specs.length - 5] : specs[specs.length - 4]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">  </TableCell>
              <TableCell className="border border-black text-center"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <span className="text-red-600 font-bold">{isDiscountAvailable ? specs[specs.length - 4] : specs[specs.length - 3]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">GST {data.quotation.gst}%</TableCell>
              <TableCell className="border border-black text-center">{(Number(data.quotation.sub_total) * (Number(data.quotation.gst) / 100)).toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <span className="text-red-600 font-bold">{isDiscountAvailable ? specs[specs.length - 3] : specs[specs.length - 2]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Round Off</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.round_off}</TableCell>
            </TableRow>
            {isDiscountAvailable &&
              <TableRow>
                <TableCell className="border-r border-black"></TableCell>
                <TableCell className="border-r border-black">
                  <span className="text-red-600 font-bold">{specs[specs.length - 2]}</span>
                </TableCell>
                <TableCell colSpan={2} className="border border-black text-center">Discount</TableCell>
                <TableCell className="border border-black text-center">{data.quotation.discount}</TableCell>
              </TableRow>
            }
            <TableRow>
              <TableCell className="border-r border-black"></TableCell>
              <TableCell className="border-r border-black">
                <span className="text-red-600 font-bold">{specs[specs.length - 1]}</span>
              </TableCell>
              <TableCell colSpan={2} className="border border-black text-center">Grand Total</TableCell>
              <TableCell className="border border-black text-center">{data.quotation.grand_total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {data.quotation.show_body_table === true &&
          <div className="mb-6 space-y-2">
            {data.quotation.quotation_products.map((product) => (
              <Table className="border border-black w-3/5" key={product.id}>
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
                  {product.quotation_item.map((item, index: number) => (
                    <React.Fragment key={item.id}>
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
                    </React.Fragment>
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