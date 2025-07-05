import { useParams } from "react-router"
import { fetchReminders } from "@/api/leads/leads.queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CalendarIcon,  Trash } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { useDeleteReminder } from "@/api/leads/leads.mutation"

const ScheduledMeeting = () => {

    const { id } = useParams();
    const { data, isPending, isError } = fetchReminders(id || "");
    const deleteReminder = useDeleteReminder();

    const onSubmit = (id: string) => {
        deleteReminder.mutate(id);
    }

    if (isPending) {
        return <>Loading</>
    }

    if (isError) {
        return <>Error...</>
    }

    return <Card>
        <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {data.reminders.map((meeting: any) => (
                    <div key={meeting.id} className="grid grid-cols-5 lg:grid-cols-9 md:grid-cols-9 items-center p-4 border rounded-lg gap-4">
                        <div className="col-span-1 flex justify-center">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <CalendarIcon className="h-4 w-4 text-blue-600" />
                            </div>
                        </div>
                        <div className="col-span-4 space-y-1">
                            <h4 className="font-medium break-words">{meeting.title}</h4>
                            <p className="text-sm text-gray-600 break-words">{meeting.message}</p>
                        </div>
                        <div className=" col-span-4 md:col-span-3">
                            <h4 className="font-medium">Meeting Schedule</h4>
                            <div className="text-sm text-gray-600 flex items-center break-words">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {new Date(meeting.send_at).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <Dialog >
                                <DialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Delete Reminder</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete? This cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit" variant="destructive" onClick={() =>onSubmit(meeting.id)}>Delete</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card >
}

export default ScheduledMeeting