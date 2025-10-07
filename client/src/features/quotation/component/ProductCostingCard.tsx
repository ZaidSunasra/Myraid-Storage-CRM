import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calculator } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import QuotationWorkingTable from "./QuotationWorkingTable";
import { useQuotation } from "@/context/QuotationContext";
import type { AddQuotation } from "zs-crm-common";

interface ProductCostingCardProps {
    form: UseFormReturn<AddQuotation>
    productId: number
    productName: string
}

const QuotationCosting = ({ form, productId, productName }: ProductCostingCardProps) => {

    const { updateCost, products, getProductTotals } = useQuotation();
    const product = products.filter(p => p.id === productId);
    const totals = getProductTotals(productId);

    return <Card>
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>{productName}</span>
            </CardTitle>
            <CardDescription>
                Add additional expenses and compute the final quotation amount
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <QuotationWorkingTable productId={productId} />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {product[0].name.startsWith("Compactor") &&
                    <>
                        <div className="space-y-2">
                            <FormField
                                defaultValue={product[0].labour_cost}
                                control={form.control}
                                name={`quotation_item.${Number(productId)}.labour_cost`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Labour Cost*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter labour cost"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    labour_cost: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                defaultValue={product[0].ss_material}
                                control={form.control}
                                name={`quotation_item.${Number(productId)}.ss_material`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SS Material*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter weight of ss material"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    ss_material: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                defaultValue={product[0].trolley_material}
                                control={form.control}
                                name={`quotation_item.${Number(productId)}.trolley_material`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trolley Material*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter weight of trolley material"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    trolley_material: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormItem>
                                <FormLabel>Total material</FormLabel>
                                <Input value={product[0].ss_material + product[0].trolley_material} disabled />
                            </FormItem>
                        </div>
                        <div className="space-y-2">
                            <FormField
                                defaultValue={product[0].total_weight}
                                control={form.control}
                                name={`quotation_item.${Number(productId)}.total_weight`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Weight*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter total weight"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    total_weight: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                defaultValue={product[0].powder_coating}
                                control={form.control}
                                name={`quotation_item.${Number(productId)}.powder_coating`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Powder Coating*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter powder coating cost"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    powder_coating: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                defaultValue={product[0].transport}
                                name={`quotation_item.${Number(productId)}.transport`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transport*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter transport cost"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    transport: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                defaultValue={product[0].accomodation}
                                name={`quotation_item.${Number(productId)}.accomodation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accomodation*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter accomodation cost"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    accomodation: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                defaultValue={product[0].installation}
                                name={`quotation_item.${Number(productId)}.installation`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Installation per body*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter installation cost of single body"
                                            type="number"
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    installation: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormItem>
                                <FormLabel>Total installation cost</FormLabel>
                                <Input value={product[0].installation * totals.totalBodies} disabled />
                            </FormItem>
                        </div>
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                defaultValue={product[0].metal_rate}
                                name={`quotation_item.${Number(productId)}.metal_rate`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Metal Rate*</FormLabel>
                                        <Input
                                            value={field.value ?? ""}
                                            placeholder="Enter metal rate"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value)
                                                updateCost(productId, {
                                                    metal_rate: value
                                                })
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {form.watch("quotation_template") && (
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`quotation_item.${Number(productId)}.set`}
                                    render={({ field }) => {
                                        const isItemWise = form.watch("quotation_template") === "item_wise";
                                        if (isItemWise && field.value !== 1) {
                                            field.onChange(1);
                                            updateCost(productId, { set: 1 });
                                        }
                                        return (
                                            <FormItem>
                                                <FormLabel>Set*</FormLabel>
                                                <Input
                                                    value={field.value ?? ""}
                                                    placeholder="Enter number of set"
                                                    type="number"
                                                    disabled={isItemWise}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        field.onChange(val);
                                                        updateCost(productId, { set: val });
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </>
                }
                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        defaultValue={product[0].profit_percent}
                        name={`quotation_item.${Number(productId)}.profit_percent`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profit (%)*</FormLabel>
                                <Input
                                    min={0}
                                    value={field.value ?? ""}
                                    placeholder="Enter profit percentage"
                                    type="number"
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value)
                                        updateCost(productId, {
                                            profit_percent: value
                                        })
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <FormField
                        defaultValue={product[0].discount}
                        control={form.control}
                        name={`quotation_item.${Number(productId)}.discount`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount (%)</FormLabel>
                                <Input
                                    min={0}
                                    value={field.value ?? ""}
                                    placeholder="Enter discount percentage"
                                    type="number"
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        field.onChange(value)
                                        updateCost(productId, {
                                            discount: value
                                        })
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </CardContent>
    </Card >
}

export default QuotationCosting