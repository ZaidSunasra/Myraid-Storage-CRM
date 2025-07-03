import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { ArrowLeft, User } from "lucide-react";

const AddEditLeadDetails = ({form, handleClick} : {form: any, handleClick: () => void}) => {
    return <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Lead Details</span>
            </CardTitle>
            <CardDescription>Enter the contact person and product information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>First Name*</FormLabel>
                                    <FormControl>
                                        <Input id="first_name" placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>Last Name*</FormLabel>
                                    <FormControl>
                                        <Input id="last_name" placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input id="email" placeholder="Enter email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>Phone No*</FormLabel>
                                    <FormControl>
                                        <Input id="phone" placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select lead source" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="google_ads">Google Ads</SelectItem>
                                        <SelectItem value="india_mart">India Mart</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Product" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="compactor">Compactor</SelectItem>
                                        <SelectItem value="locker">Locker</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <div className="space-y-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea id="description" placeholder="Add any additional notes or description about the lead" rows={4}  {...field} />
                                </FormControl>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex justify-between">
                <Button variant="outline" onClick={handleClick}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button type="submit" >
                    Save Lead
                </Button>
            </div>
        </CardContent>
    </Card>
}

export default AddEditLeadDetails;