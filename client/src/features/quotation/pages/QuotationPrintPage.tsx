import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@/shared/components/ui/button"
import { FetchQuotationById } from "@/api/quotations/quotation.queries"
import { useParams } from "react-router"
import { Skeleton } from "@/shared/components/ui/skeleton"
import ErrorDisplay from "@/shared/components/ErrorPage"
import Logo from "@/assets/logo.png"
import QuotationItemsTable from "../component/printLayouts/QuotationItemsTable"
import QuotationBodyTable from "../component/printLayouts/QuotationBodyTable"
import Terms from "../component/printLayouts/Terms&Condition"
import Heading from "../component/printLayouts/Heading"

const QuotationPrint = () => {

  const { quotation_id, id } = useParams();
  const { data, isPending, isError } = FetchQuotationById(quotation_id as string);
  const printRef = useRef<HTMLDivElement>(null)

  const [name, setName] = useState<string[]>([]);
  useEffect(() => {
    if (data?.quotation?.quotation_products && data?.quotation?.quotation_products.length > 0) {
      setName(data.quotation?.quotation_products.map(product => product.name))
    }
  }, [data]);

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
      <div ref={printRef} className="relative  w-fit p-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <img src={Logo} alt="Watermark" />
        </div>
        <Heading quotation={data.quotation} name={name} setName={setName} />
        <QuotationItemsTable quotation={data.quotation} name={name} setName={setName} />
        {data.quotation.show_body_table &&
          <div className="mb-6 space-y-2">
            {data.quotation.quotation_products.map((product) => {
              const isSetWise = data.quotation?.quotation_template === "set_wise" ? true : false
              return (
                <QuotationBodyTable product={product} key={product.id} isSetWise={isSetWise}/>
              )
            })}
          </div>
        }
        <Terms />
      </div>
    </div>
  )
}

export default QuotationPrint