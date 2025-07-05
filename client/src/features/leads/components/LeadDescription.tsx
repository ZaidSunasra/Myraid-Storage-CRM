import { useAddDescription } from "@/api/leads/leads.mutation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { addDescriptionSchema, type AddDescription } from "zs-crm-common"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Notebook, Trash } from "lucide-react";
import { Label } from "@/shared/components/ui/label";

const LeadDescription = ({ data, id }: { data: AddDescription, id: string }) => {

    const addDescription = useAddDescription();
    const initialParts = data.description?.split('.').filter((sentence) => sentence.trim() !== '').map((sentence) => sentence.trim()) ?? [];

    const form = useForm<AddDescription>({
        resolver: zodResolver(addDescriptionSchema),
        defaultValues: ({
            description: ""
        })
    });

    const handleDelete = (indexToDelete: number) => {
        const updated = initialParts.filter((_, i) => i !== indexToDelete);
        const flattened = updated.map((sentence) => sentence.trim().replace(/\.*$/, '') + '.').join(' ').trim();
        addDescription.mutate({ data: { description: flattened }, id })
    }

    const onSubmit = (formData: AddDescription) => {
        const prevData = data.description?.trim() || "";
        const finalData = prevData ? `${prevData}\n${formData.description}.` : `${formData.description}.`
        if (!id) return;
        addDescription.mutate({
            data: {
                description: finalData
            }, id
        })
        form.reset();
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Description & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label> Previous Description </Label>
                        <div className="flex items-center space-x-2">
                            <div className="flex flex-col space-y-1 w-full">
                                {initialParts.map((sentence, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-md"  >
                                        <div className="flex items-center space-x-2">
                                            <Notebook className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-foreground font-medium">{sentence.trim()}</span>
                                        </div>
                                        <Button onClick={() => handleDelete(idx)} variant="destructive" size="icon" type="button">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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