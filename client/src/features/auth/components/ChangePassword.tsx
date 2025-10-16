import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { type Dispatch, type SetStateAction } from "react";
import { useChangePassword } from "@/api/auth/auth.mutation";
import { changePasswordSchema, type ChangePassword } from "zs-crm-common";

const ChangePasswordForm = ({ setDialog }: { setDialog: Dispatch<SetStateAction<boolean>> }) => {
    
    const changePassword = useChangePassword();
    const form = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            old_password: "",
            new_password: ""
        }
    });

    const onSubmit = (data: ChangePassword) => {
        changePassword.mutate(data, {
            onSuccess: () => setDialog(false)
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-4">
                    <FormField
                        control={form.control}
                        name="old_password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>Old Password*</FormLabel>
                                    <FormControl>
                                        <Input id="old-password" placeholder="Enter old password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-2">
                                    <FormLabel>New Password*</FormLabel>
                                    <FormControl>
                                        <Input id="new_password-title" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={changePassword.isPending}>Change Password</Button>
            </form>
        </Form>
    );
}

export default ChangePasswordForm