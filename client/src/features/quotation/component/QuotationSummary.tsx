import type { UseFormReturn } from "react-hook-form"
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/shared/components/ui/card"
import { ChevronLeft, FileText } from "lucide-react"
import { FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { calculateGrandTotal, calculateGSTTotal, calculateRoundOff } from "../utils/calculateTotal"
import { Button } from "@/shared/components/ui/button"
import { useEffect } from "react"
import { useQuotation } from "@/context/QuotationContext"
import type { AddQuotation } from "zs-crm-common"
import { Textarea } from "@/shared/components/ui/textarea"

const QuotationSummary = ({ form, handlePrev, isSubmitting, type }: { form: UseFormReturn<AddQuotation>, handlePrev: () => void, isSubmitting: boolean, type: "add" | "edit" }) => {

  const { overallTotal } = useQuotation();
  const gst_amount = calculateGSTTotal(overallTotal, form);
  const round_off = calculateRoundOff(overallTotal, gst_amount);
  const grand_total = calculateGrandTotal(overallTotal, gst_amount, round_off);

  useEffect(() => {
    form.setValue("total", Number(overallTotal.toFixed(2)));
    form.setValue("grandTotal", grand_total);
    form.setValue("round_off", round_off);
  }, [overallTotal, grand_total, round_off]);

  return <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <FileText className="h-5 w-5" />
        <span>Quotation Summary</span>
      </CardTitle>
      <CardDescription>
        Calculate grand total and add tax and discount
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total*</FormLabel>
                <Input value={field.value ? field.value : 0} placeholder="Enter total" type="number" disabled />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="gst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST (%)*</FormLabel>
                <Input value={field.value ? field.value : 0} placeholder="Enter gst" type="number" onChange={(e) => field.onChange(Number(e.target.value))} min={0} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>GST Amount</FormLabel>
            <Input value={gst_amount} disabled />
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormItem>
            <FormLabel>Round Off</FormLabel>
            <Input value={round_off} disabled />
          </FormItem>
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="grandTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grand Total*</FormLabel>
                <Input {...field} placeholder="Enter total" type="number" disabled />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <Textarea
                rows={5}
                placeholder="Enter special note to display on quotation"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)} 
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </CardContent>
    <CardFooter className="w-full flex justify-between">
      <Button onClick={handlePrev}>
        <ChevronLeft className="h-4 w-4 ml-2" />
        Previous
      </Button>
      <Button type="submit" disabled={isSubmitting}>
       {type === "add" ? "Add Quotation" : "Save Changes"}
      </Button>
    </CardFooter>
  </Card>
}

export default QuotationSummary