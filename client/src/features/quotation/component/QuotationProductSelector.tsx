import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import {  Package } from "lucide-react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { capitalize, toTitleCase } from "@/utils/formatData"
import { Input } from "@/shared/components/ui/input"
import { useFetchQuotationProduct } from "@/api/quotations/quotations.mutation"
import { zodResolver } from "@hookform/resolvers/zod"
import { FetchProducts } from "@/api/products/product.queries"
import { productSelectorSchema, type ProductSelector } from "zs-crm-common"

const ProductSelectorCard = () => {

    const { data, isPending, isError } = FetchProducts();

    const form = useForm<ProductSelector>({
        resolver: zodResolver(productSelectorSchema),
        defaultValues: {
            product_type: "",
            bay: 1,
            compartment: 5,
        },
    })

    const productName = () => {
        const product = form.watch("product_type")
        const bay = form.watch("bay");
        const compartment = form.watch("compartment")
        let name = ""
        if (product === "compactor") {
            name = `${capitalize(product)} - ${bay} Bay ${compartment} Compartment`
        } else {
            name = `${capitalize(product)}`
        }
        return name
    }
    const getProducts = useFetchQuotationProduct(productName());

    const onSubmit = (data: ProductSelector) => {
        getProducts.mutate(data);
    }

    if (isError) return <>Error</>

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Product Details</span>
                    </CardTitle>
                    <CardDescription>Enter the product information for this quotation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="product_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Type*</FormLabel>
                                        <Select value={field.value ? field.value : ""} onValueChange={(val) => field.onChange(val)} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Product Type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data?.products.map((product) => (
                                                    <SelectItem key={product.id} value={product.name}>
                                                        {toTitleCase(product.name)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {form.watch("product_type") === "compactor" &&
                            <>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="bay"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="space-y-2">
                                                    <FormLabel>Bay*</FormLabel>
                                                    <FormControl>
                                                        <Input id="bay" placeholder="Enter number of bay" {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
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
                                        name="compartment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="space-y-2">
                                                    <FormLabel>Compartment*</FormLabel>
                                                    <FormControl>
                                                        <Input id="compartment" placeholder="Enter number of compartment" {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </>
                        }
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">
                            Add Products
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    </Form>
}

export default ProductSelectorCard;