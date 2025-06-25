import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginUser } from "zs-crm-common";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { useLogin } from "@/api/auth/auth.mutation";
import { useNavigate } from "react-router";
import {ArrowLeft} from "lucide-react";

const LoginPage = () => {

    const form = useForm<LoginUser>({
        resolver: zodResolver(loginSchema),
        defaultValues: ({
            email: "",
            password: ""
        })
    });

    const login = useLogin();
    const navigate = useNavigate();

    const onSubmit = (data: LoginUser) => {
        login.mutate(data);
    }

    return <div className="w-screen h-screen flex justify-center items-center font-mono bg-primary-foreground">
        <nav className="fixed top-0 w-screen p-4">
            <Button onClick={() =>navigate("/") }> <ArrowLeft />Back</Button>
        </nav>
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