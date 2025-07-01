import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";

const LeadDetails = ({ data }: { data: any }) => {

    return <>
        <Card className="bg-background">
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span> {data.first_name} {data.last_name}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>GST No.</Label>
                        <span>{data.company.gst_no} </span>
                    </div>
                    <div className="space-y-2">
                        <Label>Company</Label>
                        <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>{data.company.name}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{data.email}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{data.phone}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{data.company.address}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-background">
            <CardHeader>
                <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Source</Label>
                        <span> {data.source}</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Assigned To</Label>
                        <span> {data.user.first_name} {data.user.last_name}</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Created Date</Label>
                        <span>
                            {new Date(data.created_at).toLocaleString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <Label>Product</Label>
                        <span>{data.product}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    </>
}

export default LeadDetails;