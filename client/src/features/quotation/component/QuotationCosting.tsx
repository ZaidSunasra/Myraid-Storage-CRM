import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Calculator, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import type { UseFormReturn } from "react-hook-form"
import { useQuotation } from "@/context/QuotationContext"
import ProductCostingCard from "./ProductCostingCard"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { QUOTATION_TEMPLATE } from "zs-crm-common"
import { toTitleCase } from "@/utils/formatData"
import type { AddQuotation } from "zs-crm-common"
import { Input } from "@/shared/components/ui/input"

const QuotationCostingCard = ({ form, handlePrev, handleNext }: { form: UseFormReturn<AddQuotation>, handleNext: () => void, handlePrev: () => void }) => {

  const { products } = useQuotation()

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Quotation General Information</span>
          </CardTitle>
          <CardDescription>
            Configure genral information for quotation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="quotation_template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation Template*</FormLabel>
                    <Select value={field.value ? field.value : ""} onValueChange={(val) => field.onChange(val)}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Quotation Template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {QUOTATION_TEMPLATE.map((template) => (
                          <SelectItem key={template} value={template}>
                            {toTitleCase(template)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="show_body_table"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Show body Table in Print?*</FormLabel>
                    <Select value={String(field.value)} onValueChange={(val) => field.onChange(val === "true")}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select yes/no" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="quotation_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quotation No.*</FormLabel>
                    <Input {...field} placeholder="Enter quotation no." />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
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
    </>
  )
}

export default QuotationCostingCard