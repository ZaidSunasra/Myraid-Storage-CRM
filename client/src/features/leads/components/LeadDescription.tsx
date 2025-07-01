import { useAddDescription } from "@/api/leads/leads.mutation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { addDescriptionSchema, type AddDescription } from "zs-crm-common"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

const LeadDescription = ({ data, id }: { data: string, id: string }) => {

    const addDescription = useAddDescription();

    const form = useForm<AddDescription>({
        resolver: zodResolver(addDescriptionSchema),
        defaultValues: ({
            description: data
        })
    });

    const onSubmit = (data: AddDescription) => {
        if (!id) return;
        addDescription.mutate({ data, id })
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Description & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="description"
                                            placeholder="Add lead description..."
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">
                        Add Description
                    </Button>
                </CardContent>
            </Card>
        </form>
    </Form >
}

export default LeadDescription;