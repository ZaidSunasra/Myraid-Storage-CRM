import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { ArrowLeft, Eye, X } from "lucide-react"
import { NavLink, useParams } from "react-router"
import QuotationSideBar from "../component/QuotationSideBar"
import { useState } from "react"
import { Form } from "@/shared/components/ui/form"
import QuotationCostingCard from "../component/QuotationCosting"
import QuotationSummary from "../component/QuotationSummary"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuotation } from "@/context/QuotationContext"
import { useAddQuotation } from "@/api/quotations/quotations.mutation"
import { addQuotationSchema, type AddQuotation } from "zs-crm-common"
import PreviewQuotationPage from "./PreviewQuotationPage"
import QuotationProducts from "../component/QuotationProducts"
import ProductSelectorCard from "../component/QuotationProductSelector"
import { toast } from "sonner"

const AddQuotationPage = () => {
  const { id } = useParams()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const { products } = useQuotation()
  const addQuotation = useAddQuotation()

  const form = useForm<AddQuotation>({
    resolver: zodResolver(addQuotationSchema),
    defaultValues: {
      quotation_template: "set_wise",
      quotation_item: products,
      gst: 18,
      grandTotal: 0,
      round_off: 0,
      show_body_table: true,
      note: null,
      total: 0,
      quotation_no: id
    },
  })

  const handleNext = () => setCurrentStep((step) => step + 1)
  const handlePrev = () => setCurrentStep((step) => step - 1)

  const onSubmit = (data: AddQuotation) => {
    const payload = {
      ...data,
      quotation_item: products
        .map((p) => ({
          ...p,
          items: p.items.filter((it) => !it.removed),
        }))
        .filter((p) => p.items.length > 0),
    };
    if (payload.quotation_item.length == 0) {
      toast.error("Atleast 1 product or item required")
    } else {
      addQuotation.mutate({ data: payload, deal_id: id as string })
    }
  }

  return (
    <div className="bg-accent min-h-screen">
      <Navbar />
      <div className="mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between flex-col sm:flex-row">
            <div className="flex items-center space-x-4 mb-6">
              <NavLink to={`/deal/${id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </NavLink>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Add New Quotation</h1>
                <p className="text-muted-foreground">
                  Create a new quotation in your CRM system
                </p>
              </div>
            </div>
            {!showPreview ? (
              <Button className="mb-4 flex gap-2" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4" />
                Preview Quotation
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="mb-4 flex gap-2"
                onClick={() => setShowPreview(false)}
              >
                <X className="w-4 h-4" />
                Close Preview
              </Button>
            )}
          </div>
          {!showPreview ? (
            <div className="flex flex-col gap-8">
              <QuotationSideBar currentStep={currentStep} />
              {currentStep === 1 && (
                <ProductSelectorCard />
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {currentStep === 1 && (
                    <QuotationProducts handleNext={handleNext} />
                  )}
                  {currentStep === 2 && (
                    <QuotationCostingCard
                      form={form}
                      handleNext={handleNext}
                      handlePrev={handlePrev}
                    />
                  )}
                  {currentStep === 3 && (
                    <QuotationSummary form={form} handlePrev={handlePrev} isSubmitting={addQuotation.isPending} type="add" />
                  )}
                </form>
              </Form>
            </div>
          ) : (
            <div className="bg-white shadow rounded-xl p-4 overflow-auto">
              <h2 className="text-lg font-semibold mb-4">Quotation Preview</h2>
              <PreviewQuotationPage data={form.watch()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddQuotationPage
