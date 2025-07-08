import { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, format, isSameDay } from "date-fns";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReminderByMonth } from "@/api/leads/leads.queries";
import formatDate from "@/utils/formatDate";
import { useNavigate } from "react-router";

const CalendarPage = () => {

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { data, isError, isPending } = fetchReminderByMonth(formatDate(currentMonth));
    const navigate = useNavigate()

    const days = (() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });

        const daysArr: Date[] = [];
        let day = start;

        while (day <= end) {
            daysArr.push(day);
            day = addDays(day, 1);
        }

        return daysArr;
    })();

    const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));

    if (isPending) return <>Loading..</>
    if(isError) return <>Error...</>

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="p-4 max-w-7xl mx-auto bg-background mt-8 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <Button onClick={prevMonth} className="text-sm px-2 py-1 border rounded"  >
                    <ChevronLeft />
                    Previous
                </Button>
                <h2 className="text-xl font-bold">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <Button onClick={nextMonth} className="text-sm px-2 py-1 border rounded" >
                    Next
                    <ChevronRight />
                </Button>
            </div>
            <div className="hidden lg:grid grid-cols-7 gap-2 text-center font-semibold mb-2 text-sm text-muted-foreground">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {days.map((day) => {
                    const formatted = format(day, "yyyy-MM-dd");
                    const meetings = data.reminders[formatted] || [];
                    return (
                        <div
                            key={formatted}
                            className={`border rounded p-2 min-h-24 flex flex-col justify-between
                                hover:bg-blue-300 hover:border-blue-500 
                                ${format(day, "MM") !== format(currentMonth, "MM") ? "opacity-30" : ""} 
                                ${isSameDay(formatted, new Date()) ? "border-blue-500" : ""}`}
                        >
                            <div className="font-medium text-sm">{format(day, "d")}</div>
                            {meetings.length > 0 &&
                                [...new Map(meetings.map((m: any) => [m.lead_id, m])).values()].map(
                                    (meeting: any) => (
                                        <div
                                            key={meeting.lead_id}
                                            className="bg-blue-500 mb-2 p-3 rounded text-white text-sm shadow hover:bg-blue-600 transition duration-200 cursor-pointer"
                                            onClick={() => navigate(`/lead/${meeting.lead_id}`)}
                                            title={meeting.title}
                                        >
                                            {meeting.title.length > 20
                                                ? meeting.title.slice(0, 20) + "..."
                                                : meeting.title} - {meeting.client_name} from {meeting.company_name}
                                        </div>
                                    )
                                )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
}

export default CalendarPage; 