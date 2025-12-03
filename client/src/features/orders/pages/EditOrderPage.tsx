import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { Form } from "@/shared/components/ui/form"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { NavLink, useParams } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { addOrderSchema, type AddOrder } from "zs-crm-common"
import AddOrderDetails from "../components/AddOrderDetails"
import { FetchOrderById } from "@/api/orders/orders.queries"
import EditPageLoader from "@/shared/components/loaders/EditPageLoader"
import ErrorDisplay from "@/shared/components/ErrorPage"
import { useEffect, useState } from "react"
import { useEditOrder } from "@/api/orders/orders.mutation"

const EditOrderPage = () => {

    const { order_id } = useParams();
    const { data, isPending, isError } = FetchOrderById(order_id as string);
    const [formReady, setFormReady] = useState(false);
    const editOrder = useEditOrder()

    const form = useForm<AddOrder>({
        resolver: zodResolver(addOrderSchema),
        defaultValues: ({
            quotation_no: "",
            height: "",
            total: 0,
            total_body: 0,
            pi_number: false,
            po_number: "",
            dispatch_at: undefined,
            status: "pending",
            count_order: false,
            powder_coating: false,
            deal_id: "",
            fitted_by: "",
            bill_number: ""
        }),
    });

    useEffect(() => {
        if (data?.order && !isPending && !isError) {
            form.reset({
                quotation_no: "",
                height: data.order.height,
                total: data.order.balance,
                total_body: data.order.total_body,
                pi_number: data.order.pi_number,
                po_number: data.order.po_number,
                dispatch_at: new Date(data.order.dispatch_at),
                status: data.order.status,
                powder_coating: data.order.powder_coating,
                count_order: data.order.count_order,
                deal_id: data.order.deal_id,
                fitted_by: data.order.fitted_by,
                bill_number: data.order.bill_number
            });
            setFormReady(true)
        }
    }, [data, form, isPending, isError]);

    const onSubmit = (data: AddOrder) => {
        editOrder.mutate({ data, id: order_id as string })
    }

    if (isPending) return <EditPageLoader showSidebar={false} />
    if (isError) return <ErrorDisplay message="Failed to load data. Refresh or please try again later" fullPage />

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to="/order">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit New Order</h1>
                        <p className="text-muted-foreground">Edit an exisiting order in your CRM system</p>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {formReady &&
                            <AddOrderDetails form={form} context="edit" isSubmitting={editOrder.isPending} />
                        }
                    </form>
                </Form>
            </div>
        </div>
    </div>
}

export default EditOrderPage