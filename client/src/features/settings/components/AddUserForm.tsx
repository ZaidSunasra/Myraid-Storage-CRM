import { useEditUser, useSignup } from "@/api/auth/auth.mutation"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toTitleCase } from "@/utils/formatData"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { type AddUser, DEPARTMENTS, type EditUser, editUserSchema, signupSchema } from "zs-crm-common"

const AddUserForm = ({ userData, info, reset }: { userData: AddUser | EditUser | null, info: { id: number | null, type: "add" | "edit" | null }, reset: () => void }) => {

    const signup = useSignup();
    const editUser = useEditUser();

    const form = useForm<AddUser | EditUser>({
        resolver: zodResolver(info.type === "add" ? signupSchema : editUserSchema),
        defaultValues: ({
            first_name: userData?.first_name,
            last_name: userData?.last_name,
            phone: userData?.phone,
            email: userData?.email,
            quotation_code: userData?.quotation_code ?? undefined,
            department: userData?.department,
            password: ""
        }),
    });

    const onSubmit = (data: AddUser | EditUser) => {
        if (info.type === "add") {
            signup.mutate(data as AddUser, {
                onSuccess: () => reset()
            });
        } else if (info.type === "edit") {
            editUser.mutate({ data: data as EditUser, id: info.id || 0 }, {
                onSuccess: () => reset()
            })
        }
    }

    return <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>User Details</span>
                </CardTitle>
                <CardDescription>
                    Enter the person information
                </CardDescription>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => reset()}
                className="mt-2 sm:mt-0 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
                <X className="h-5 w-5" />
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                                            <FormLabel>Email*</FormLabel>
                                            <FormControl>
                                                <Input id="email" placeholder="Enter email" {...field} />
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
                                            <FormLabel>Phone*</FormLabel>
                                            <FormControl>
                                                <Input id="phone" placeholder="Enter phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {info.type === "add" && <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel>Password*</FormLabel>
                                            <FormControl>
                                                <Input id="password" placeholder="Enter password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>}
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="quotation_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel>Quotation Code</FormLabel>
                                            <FormControl>
                                                <Input id="quotation_code" placeholder="Enter quotation code" {...field} />
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
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department*</FormLabel>
                                        <Select
                                            value={field.value ? field.value : ""}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {DEPARTMENTS.map((department: string) => (
                                                    <SelectItem key={department} value={department}>
                                                        {toTitleCase(department)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" >
                            Add User
                        </Button>
                    </div>
                </form>
            </Form>
        </CardContent>
    </Card>
}

export default AddUserForm