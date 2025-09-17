import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ChevronRight, Package } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toTitleCase } from "@/utils/formatData"
import { Input } from "@/shared/components/ui/input"
import { useFetchQuotationProduct } from "@/api/quotations/quotations.mutation"
import { useQuotation } from "@/context/QuotationContext"
import QuotationProductTable from "./QuotationProductTable"
import { PRODUCT_TYPE, QUOTATION_TEMPLATE, type AddQuotation } from "zs-crm-common"

const QuotationProductSelector = ({ form, handleNext }: { form: UseFormReturn<AddQuotation>, handleNext: () => void }) => {

  const getProduct = useFetchQuotationProduct(form.watch("bay"), form.watch("compartment"));
  const { products } = useQuotation();

  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Package className="h-5 w-5" />
        <span>Product Details</span>
      </CardTitle>
      <CardDescription>Enter the product information for this quotation</CardDescription>
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
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type*</FormLabel>
                <Select value={field.value ? field.value : ""} onValueChange={(val) => field.onChange(val)}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Product Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_TYPE.map((product) => (
                      <SelectItem key={product} value={product}>
                        {toTitleCase(product)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.watch("product_type") === "compactor" &&
          <>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="bay"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel>Bay*</FormLabel>
                      <FormControl>
                        <Input id="bay" placeholder="Enter number of bay" {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="compartment"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <FormLabel>Compartment*</FormLabel>
                      <FormControl>
                        <Input id="compartment" placeholder="Enter number of compartment" {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </>
        }
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!form.watch("product_type") || !form.watch("quotation_template")}
          onClick={() => getProduct.mutate({
            product_type: form.getValues("product_type"),
            bay: form.getValues("bay"),
            compartment: form.getValues("compartment")
          })}>
          Add Products
        </Button>
      </div>
      {products.length > 0 &&
        <QuotationProductTable />
      }
      <CardFooter className="flex justify-end px-0">
        <Button
          onClick={handleNext}
          disabled={!form.watch("quotation_template") || !form.watch("product_type") || products.length <= 0}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </CardContent>
  </Card>
}

export default QuotationProductSelector