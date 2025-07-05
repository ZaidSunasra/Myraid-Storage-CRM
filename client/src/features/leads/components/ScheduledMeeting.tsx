import { useParams } from "react-router"
import { fetchReminders } from "@/api/leads/leads.queries"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { CalendarIcon, Edit } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

const ScheduledMeeting = () => {

    const { id } = useParams();
    const { data, isPending, isError } = fetchReminders(id || "");

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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
                                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">Cancel Meeting</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card >
}

export default ScheduledMeeting