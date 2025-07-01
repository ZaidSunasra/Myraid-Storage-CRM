import { useForm } from "react-hook-form"
import { useParams } from "react-router"
import { addReminderSchema, type AddReminder } from "zs-crm-common"
import { cn } from "@/shared/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { useAddReminder } from "@/api/leads/leads.mutation"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Textarea } from "@/shared/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import ScheduledMeeting from "./ScheduledMeeting"

const LeadScheduling = () => {

    const { id } = useParams();

    const saveReminder = useAddReminder();

    const form = useForm({
        resolver: zodResolver(addReminderSchema),
        defaultValues: ({
            title: "",
            send_at: undefined,
            message: "",
            related_id: id,
            related_type: "LEAD",
            reminder_type: "CLIENT_MEETING"
        })
    })

    function onSubmit(data: AddReminder) {
        saveReminder.mutate(data, {
            onSuccess: () => {
                form.reset();
            }
        });
    }

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Schedule Meeting</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel>Title*</FormLabel>
                                            <FormControl>
                                                <Input id="meeting-title" placeholder="Enter meeting title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="send_at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <div className="space-y-2">
                                            <FormLabel>Date of reminder*</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value as Date, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value as Date | undefined}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date()
                                                        }
                                                        captionLayout="dropdown"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription></FormDescription>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="space-y-2 ">
                                        <FormLabel>Meeting Notes*</FormLabel>
                                        <FormControl>
                                            <Textarea id="meeting-notes" placeholder="Add meeting agenda or notes..." rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Schedule Meeting</Button>
                    </CardContent >
                </Card >
            </form>
        </Form >
       <ScheduledMeeting />
    </>
}

export default LeadScheduling;