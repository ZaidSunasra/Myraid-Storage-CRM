import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginUser } from "zs-crm-common";
import { useLogin } from "@/api/auth/auth.mutation";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

const LoginForm = () => {
	const form = useForm<LoginUser>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

	const login = useLogin();

	const onSubmit = (data: LoginUser) => {
		login.mutate(data);
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 px-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
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
							<FormItem>
								<FormLabel>Password*</FormLabel>
								<FormControl>
									<Input placeholder="Enter password" {...field} type="password" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full mt-2" disabled={login.isPending}>
						{login.isPending ? "Logging in..." : "Login"}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default LoginForm;
