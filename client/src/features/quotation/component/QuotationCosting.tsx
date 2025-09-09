import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calculator, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button"

import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import QuotationWorkingTable from "./QuotationWorkingTable";
import type { AddQuotation } from "zs-crm-common";

const QuotationCosting = ({ form, handlePrev, handleNext }: { form: UseFormReturn<AddQuotation>, handleNext: () => void, handlePrev: () => void }) => {
  return <Card>
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="labour_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Labour Cost*</FormLabel>
                <Input {...field} placeholder="Enter labour cost" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="trolley_material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trolley Material*</FormLabel>
                <Input {...field} placeholder="Enter weight of trolley material" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="sheet_material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sheet Material*</FormLabel>
                <Input {...field} placeholder="Enter weight of sheet material" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="total_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Weight*</FormLabel>
                <Input {...field} placeholder="Enter total weight" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="powder_coating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Powder Coating*</FormLabel>
                <Input {...field} placeholder="Enter powder coating cost" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="transport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transport*</FormLabel>
                <Input {...field} placeholder="Enter transport cost" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="accomodation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accomodation*</FormLabel>
                <Input {...field} placeholder="Enter accomodation cost" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="installation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Installation*</FormLabel>
                <Input {...field} placeholder="Enter installation cost" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="metal_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metal Rate*</FormLabel>
                <Input {...field} placeholder="Enter metal rate" type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1 md:col-span-3 lg:col-span-5">
          <QuotationWorkingTable />
        </div>
      </div>
    </CardContent>
    <CardFooter className="w-full flex justify-between">
      <Button onClick={handlePrev}>
        <ChevronLeft className="h-4 w-4 ml-2" />
        Previous
      </Button>
      <Button onClick={handleNext}>
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </CardFooter>
  </Card >
}

export default QuotationCosting