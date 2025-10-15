import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { Form } from "@/shared/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { NavLink, useParams } from "react-router"
import AddOrderDetails from "../components/AddOrderDetails"
import { useAddOrder } from "@/api/orders/orders.mutation"
import { addOrderSchema, type AddOrder } from "zs-crm-common"

const AddOrderPage = () => {

    const { id } = useParams();
    const addOrder = useAddOrder();

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
            colour: "",
            deal_id: id ? String(id) : "",
            fitted_by: "",
            bill_number: ""
        }),
    });

    const onSubmit = (data: AddOrder) => {
        addOrder.mutate({ data })
        console.log(data)
    }

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
                        <h1 className="text-2xl font-bold text-foreground">Add New Order</h1>
                        <p className="text-muted-foreground">Create a new order in your CRM system</p>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="space-y-8">
                        <AddOrderDetails form={form} context="add" isSubmitting={addOrder.isPending}/>
                    </form>
                </Form>
            </div>
        </div>
    </div>
}

export default AddOrderPage