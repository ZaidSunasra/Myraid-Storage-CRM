import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Calculator, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import type { UseFormReturn } from "react-hook-form"
import { useQuotation } from "@/context/QuotationContext"
import ProductCostingCard from "./ProductCostingCard"
import type { AddQuotation } from "zs-crm-common"

const QuotationCosting = ({ form, handlePrev, handleNext }: { form: UseFormReturn<AddQuotation>, handleNext: () => void, handlePrev: () => void }) => {
  
  const { products } = useQuotation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Quotation Costing</span>
        </CardTitle>
        <CardDescription>
          Add additional expenses and compute the final quotation amount
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {products.map((product) => (
          <ProductCostingCard
            key={product.id}
            form={form}
            productId={product.id}
            productName={product.name}
          />
        ))}
      </CardContent>
      <CardFooter className="w-full flex justify-between">
        <Button onClick={handlePrev}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default QuotationCosting