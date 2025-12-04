import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Info } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { useForm } from 'react-hook-form';
import { addColourSchema, type AddColour, type Order } from 'zs-crm-common'
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { format } from 'date-fns';
import { useAddColour } from '@/api/orders/orders.mutation';
import { useParams } from 'react-router';
import { toTitleCase } from '@/utils/formatData';

const ColourDetails = ({ data }: { data: Order }) => {

    const { order_id } = useParams();
    const addColour = useAddColour(order_id as string);

    const latestIndex = data.colour_change.length - 1;
    const latestColour = data.colour_change[latestIndex];
    const previousColours = data.colour_change.slice(0, latestIndex);

    const form = useForm<AddColour>({
        resolver: zodResolver(addColourSchema),
        defaultValues: {
            colour: ""
        }
    });

    const onPostSubmit = (formData: AddColour) => {
        addColour.mutate({ data: formData, order_id: String(order_id) })
        form.reset()
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onPostSubmit)} className="w-full space-y-4">
                <Card className="bg-background">
                    <CardHeader>
                        <CardTitle>Colour History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.colour_change.length > 0 &&
                            <>
                                <div className="space-y-2">
                                    <Label>Latest Colour</Label>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex flex-col space-y-1 w-full">
                                            {latestColour && (
                                                <div
                                                    key={latestColour.id}
                                                    className="flex flex-col sm:flex-row items-start justify-between bg-muted p-4 rounded-lg shadow-sm hover:bg-muted/80 transition"
                                                >
                                                    <div className="flex items-start gap-3 mb-2 sm:mb-0">
                                                        <Info className="h-6 w-6 mt-1 text-primary" />
                                                        <div>
                                                            <div className="text-sm font-medium break-words">
                                                                {toTitleCase(latestColour.colour)}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Last Updated by {latestColour.user.first_name} {latestColour.user.last_name} on{" "}
                                                                {format(latestColour.changed_on as Date, "dd/MM/yyyy hh:mm a")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Previous Colours</Label>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex flex-col space-y-1 w-full">
                                            {previousColours.map((colour) => (
                                                <div
                                                    key={colour.id}
                                                    className="flex flex-col sm:flex-row items-start justify-between bg-muted p-4 rounded-lg shadow-sm hover:bg-muted/80 transition"
                                                >
                                                    <div className="flex items-start gap-3 mb-2 sm:mb-0">
                                                        <Info className="h-6 w-6 mt-1 text-primary" />
                                                        <div>
                                                            <div className="text-sm font-medium break-words">
                                                                {toTitleCase(colour.colour)}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                Last Updated by {colour.user.first_name} {colour.user.last_name} on{" "}
                                                                {format(colour.changed_on as Date, "dd/MM/yyyy hh:mm a")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="colour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Colour*</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={5}
                                                placeholder="Enter colour name"
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Add Colour</Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

export default ColourDetails