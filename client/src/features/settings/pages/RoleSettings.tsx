import { useEditPermission } from "@/api/permissions/permission.mutation"
import { FetchPermissions } from "@/api/permissions/permissions.queries"
import ErrorDisplay from "@/shared/components/ErrorPage"
import DivLoader from "@/shared/components/loaders/DivLoader"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/components/ui/form"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import { ROLE_COLORS } from "@/utils/customStyle"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { DEPARTMENTS, editPermissionSchema, type EditPermission, type GetPermissionOutput } from "zs-crm-common"

const RoleSettings = () => {

  const { data, isPending, isError } = FetchPermissions();
  const [dialogData, setDialogData] = useState<{ open: boolean, data: GetPermissionOutput | null, action: "edit" | null }>({ open: false, data: null, action: null });
  const editPermission = useEditPermission();

  const form = useForm<EditPermission>({
    resolver: zodResolver(editPermissionSchema),
    defaultValues: {
      allowed_dept: []
    }
  });

  useEffect(() => {
    if (dialogData.open && dialogData.data) {
      form.reset({
        allowed_dept: dialogData.data.allowed_dept || [],
      });
    }
  }, [dialogData, form]);

  const onSubmit = (data: EditPermission) => {
    editPermission.mutate({ data, id: String(dialogData.data?.id)}, {
      onSuccess: () => setDialogData({ open: false, data: null, action: null })
    })
  };

  if (isPending) return <DivLoader height={64} showHeading={true} />;
  if (isError) return <ErrorDisplay message="Failed to load data" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Access Settings</h2>
        <p className="text-muted-foreground">
          Easily customize which departments can access specific features.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.permissions.map((permission) => (
          <Card
            key={permission.id}
            className="shadow-sm hover:shadow-md rounded-xl transition-all border border-border hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle className="capitalize">
                {permission.permission_key.replace(/_/g, " ")}
              </CardTitle>
              <CardDescription>
                Configure departments allowed to access this feature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {permission.allowed_dept.length > 0 ? (
                  permission.allowed_dept.map((dept: string, i: number) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className={`capitalize px-3 py-1 ${ROLE_COLORS[dept] || "bg-gray-100 text-gray-800"}`}
                    >
                      {dept}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No departments assigned
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setDialogData({ open: true, action: "edit", data: permission })}
              >
                <Pencil className="h-4 w-4 text-green-600" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={dialogData.open} onOpenChange={(open) => setDialogData((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {dialogData.action != null ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader className="mb-4">
                  <DialogTitle>Edit Access for:
                    <span className="capitalize font-semibold ml-1">
                      {dialogData?.data?.permission_key.replace(/_/g, " ")}
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    Edit Permission
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="allowed_dept"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Select Departments</FormLabel>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {DEPARTMENTS.map((dept) => (
                          <FormControl key={dept}>
                            <div className="flex items-center space-x-2  rounded-md p-2 hover:bg-accent transition cursor-pointer">
                              <Checkbox
                                id={dept}
                                checked={field.value.includes(dept)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, dept]);
                                  } else {
                                    field.onChange(field.value.filter((v) => v !== dept));
                                  }
                                }}
                              />
                              <Label
                                htmlFor={dept}
                                className="capitalize text-sm font-medium cursor-pointer select-none w-full"
                              >
                                {dept}
                              </Label>
                            </div>
                          </FormControl>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleSettings;