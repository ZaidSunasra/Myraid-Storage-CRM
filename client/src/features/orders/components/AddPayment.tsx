import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import {format, isAfter, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";
import { useAddPayment } from "@/api/orders/orders.mutation";
import { useParams } from "react-router";
import { addPaymentSchema, type AddPayment} from "zs-crm-common";

const AddPaymentForm = () => {

    const {order_id} = useParams();
    const addPayment = useAddPayment(order_id as string);
    const form = useForm<AddPayment>({
        resolver: zodResolver(addPaymentSchema),
        defaultValues: {
            amount: 0,
            date: undefined,
        }
    });

    const onSubmit = (data: AddPayment) => {
        addPayment.mutate({data, order_id: order_id as string})
    };

    return <Card className="bg-background">
        <CardHeader>
            <CardTitle>Add Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Form {...form}>
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
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value as Date, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value as Date | undefined} onSelect={field.onChange}
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
                        <Button type="submit">Add Payment</Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default AddPaymentForm