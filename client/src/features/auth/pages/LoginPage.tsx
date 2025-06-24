import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginFormSchema, type loginFormType } from "../auth.validation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

const LoginPage = () => {

    const form = useForm<loginFormType>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: ({
            email: "",
            password: ""
        })
    });

    const onSubmit = (data: loginFormType) => {
        console.log(data);
    }

    return <div className="w-screen h-screen flex justify-center items-center">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/4 border-2 p-4 rounded">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Email*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mb-4">
                            <FormLabel>Password*</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter password" {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    </div>
}

export default LoginPage;