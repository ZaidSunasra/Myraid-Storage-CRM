import { useAddProduct, useEditProduct } from "@/api/products/product.mutation"
import { FetchProducts } from "@/api/products/product.queries"
import ErrorDisplay from "@/shared/components/ErrorPage"
import DivLoader from "@/shared/components/loaders/DivLoader"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Separator } from "@/shared/components/ui/separator"
import { capitalize } from "@/utils/formatData"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { modifyProductSchema, type ModifyProduct, type Product } from "zs-crm-common"

const ProductSettings = () => {

  const { data, isPending, isError } = FetchProducts();
  const addProduct = useAddProduct();
  const editProduct = useEditProduct();
  const [dialogData, setDialogData] = useState<{ open: boolean, data: Product | null, action: "edit" | "add" | null }>({ open: false, data: null, action: null });
  const form = useForm<ModifyProduct>({
    resolver: zodResolver(modifyProductSchema),
    defaultValues: {
      name: ""
    }
  });

  const onSubmit = (data: ModifyProduct) => {
    dialogData.action === "add" ?
      addProduct.mutate(data.name, {
        onSuccess: () => setDialogData({ open: false, data: null, action: null })
      }) :
      editProduct.mutate({ name: data.name, id: String(dialogData.data?.id) }, {
        onSuccess: () => setDialogData({ open: false, data: null, action: null })
      })
  }

  if (isPending) return <DivLoader height={64} showHeading={true} />
  if (isError) return <ErrorDisplay message="Failed to load data"/>

  return <>
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Product Settings</h2>
        <p className="text-muted-foreground">Manage your product catalog and options.</p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </div>
            <Button className="w-full sm:w-fit" onClick={() => setDialogData({ open: true, data: null, action: "add" })}>
              <Plus className="h-5 w-5" />
              Add Product
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-2 p-4 font-medium">
                  <div>Product Name</div>
                  <div className="text-right">Edit</div>
                </div>
                <Separator />
                {data.products.map((product) => (
                  <div key={product.id} className="grid grid-cols-2 items-center p-2">
                    <div>{capitalize(product.name)}</div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm"
                        onClick={() => {
                          setDialogData({ open: true, data: product, action: "edit" }),
                            form.setValue("name", `${product.name}`)
                        }
                        }>
                        <Pencil className="h-5 w-5 text-green-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
    <Dialog open={dialogData.open} onOpenChange={(open) => setDialogData((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {dialogData.action != null ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className="mb-4">
                <DialogTitle>{capitalize(dialogData.action)} Product</DialogTitle>
                <DialogDescription>
                  {dialogData.action === "add" ? "Add new product" : "Edit existing product"}
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="space-y-2">
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Enter name of product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={addProduct.isPending}>
                {dialogData.action === "add" ? "Add Product" : "Edit Product"}
              </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </DialogContent>
    </Dialog>
  </>
}

export default ProductSettings;