import { useNotifications } from "@/context/NotificationContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft, Bell, CheckCheck, Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import NotificationCard from "../components/NotificationCard";
import { fetchReadNotifications } from "@/api/leads/leads.queries";
import ReadNotifications from "../components/ReadNotifications";

const NotificationPage = () => {

    const { isLoading, notifications, unreadCount } = useNotifications();
    const { data: readNotifData, isLoading: readNotifLoading } = fetchReadNotifications();
    const navigate = useNavigate();

    if (isLoading || readNotifLoading) return <>Loading..</>

    console.log(notifications);

    return (
        <div className="min-h-screen bg-accent">
            <div className="bg-card border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/lead")}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                                    <Bell className="h-6 w-6" />
                                    <span>Notifications</span>
                                </h1>
                                <p className="text-muted-foreground">Stay updated with your CRM activities</p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <CheckCheck className="h-4 w-4 mr-2" />
                                Mark All as Read
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Tabs className="space-y-6" defaultValue="unread">
                    <TabsList className="grid w-full grid-cols-2 bg-background">
                        <TabsTrigger value="unread" className="flex items-center space-x-2">
                            <Bell className="h-4 w-4" />
                            <span>Unread</span>
                            {unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white ml-2">{unreadCount}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="past" className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Past Notifications</span>
                            <Badge variant="secondary" className="ml-2">
                                {readNotifData.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="unread" className="space-y-4">
                        {notifications.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Unread Notifications ({unreadCount})</h2>
                                </div>
                                <div className="space-y-3">
                                    {notifications.map((notification) => (
                                        <NotificationCard key={notification.id} notification={notification} />
                                    ))}

                                </div>
                            </>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="p-4 bg-green-100 rounded-full mb-4">
                                        <CheckCheck className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                                    <p className="text-muted-foreground text-center">
                                        You have no unread notifications. Great job staying on top of things!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="past" className="space-y-4">
                        {readNotifData.notifications.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Unread Notifications ({readNotifData.notifications.length})</h2>
                                </div>
                                <div className="space-y-3">
                                    {readNotifData.notifications.map((notification: any) => (
                                        <ReadNotifications key={notification.id} notification={notification} />
                                    ))}

                                </div>
                            </>
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="p-4 bg-green-100 rounded-full mb-4">
                                        <CheckCheck className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                                    <p className="text-muted-foreground text-center">
                                        You have no past notifications. Great job staying on top of things!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default NotificationPage;
