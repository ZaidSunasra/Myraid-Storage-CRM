import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { format, isAfter, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { useEditPayment } from "@/api/orders/orders.mutation";
import { useParams } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import { addPaymentSchema, type AddPayment, type Advance } from "zs-crm-common";

const EditPayment = ({ data, setDialog }: { data: Advance, setDialog: Dispatch<SetStateAction<{ open: boolean, data: any, action: "edit" | "delete" | null }>> }) => {

    const orderId = data.id;
    const { order_id } = useParams();
    const editPayment = useEditPayment(order_id as string);
    const form = useForm<AddPayment>({
        resolver: zodResolver(addPaymentSchema),
        defaultValues: {
            amount: data.advance_amount,
           date: data.advance_date ? new Date(data.advance_date) : undefined,
        }
    });

    const onSubmit = (data: AddPayment) => {
        editPayment.mutate({ data, id: String(orderId) }, {
            onSuccess: () => setDialog({open: false, action: null, data: null})
        })
    };

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount*</FormLabel>
                            <Input
                                placeholder="Enter amount paid"
                                type="number"
                                value={field.value ? String(field.value) : ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <div className="space-y-2">
                                <FormLabel>Date of payment*</FormLabel>
                                <div className="flex space-x-2">
                                    <Popover modal>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value as Date | undefined} onSelect={(val) => field.onChange(val)}
                                                captionLayout="dropdown"
                                                disabled={(date) => isAfter(date, startOfDay(new Date()))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    </Form>
}

export default EditPayment