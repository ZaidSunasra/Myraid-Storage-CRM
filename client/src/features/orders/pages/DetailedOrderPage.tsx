import { FetchOrderById } from "@/api/orders/orders.queries"
import { usePermissions } from "@/context/PermissionContext"
import { useUser } from "@/context/UserContext"
import DrawingList from "@/shared/components/DrawingList"
import DrawingUploads from "@/shared/components/DrawingUploads"
import ErrorDisplay from "@/shared/components/ErrorPage"
import DetailedPageLoader from "@/shared/components/loaders/DetailedPageLoader"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router"
import OrderPaymentDetail from "../components/OrderPaymentDetail"
import AddPayment from "../components/AddPayment"
import { capitalize } from "@/utils/formatData"
import OrderDetails from "../components/OrderDetails"
import type { Order } from "zs-crm-common"
import { useState } from "react"
import { useDeleteOrder } from "@/api/orders/orders.mutation"
import ColourDetails from "../components/ColourDetails"

const DetailedOrderPage = () => {

    const { order_id, id } = useParams();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "info";
    const { data, isPending, isError } = FetchOrderById(order_id as string);
    const [dialog, setDialog] = useState<boolean>(false);
    const { user } = useUser();
    const navigate = useNavigate();
    const { canView } = usePermissions();
    const deleteOrder = useDeleteOrder()

    const handleDelete = () => {
        deleteOrder.mutate(order_id as string)
    }

    if (isPending) return <DetailedPageLoader />
    if (isError) return <ErrorDisplay fullPage />

    console.log(data)

    return <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-0 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 p-2 sm:p-0 gap-4">
                    <div className="flex items-center">
                        <NavLink to="/order">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </NavLink>
                        <div>
                            {user?.department !== "factory" &&
                                <h1 className="text-2xl font-bold ">
                                    {capitalize(data?.order?.deal.company.name as string)}
                                </h1>
                            }
                            <p className="text-gray-600">{data?.order?.deal_id}</p>
                        </div>
                    </div>
                    {user?.department && canView(user?.department, "add_order") &&
                        <Button onClick={() => navigate(`/order/edit/${id}/${order_id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                        </Button>
                    }
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Tabs defaultValue={tab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3 bg-background">
                            <TabsTrigger value="info"> Deal Information</TabsTrigger>
                            <TabsTrigger value="drawing">Drawings</TabsTrigger>
                            {user?.department && canView(user.department, "view_payment_information") &&
                                <TabsTrigger value="payment">Payment</TabsTrigger>
                            }
                        </TabsList>
                        <TabsContent value="info" className="space-y-6">
                            <OrderDetails data={data.order as Order} />
                            <ColourDetails data={data.order as Order}/>
                        </TabsContent>
                        <TabsContent value="drawing" className="space-y-6">
                            <DrawingUploads context="order" />
                            <DrawingList context="order" />
                        </TabsContent>
                        {user?.department && canView(user.department, "view_payment_information") &&
                            <TabsContent value="payment" className="space-y-6">
                                <AddPayment />
                                <OrderPaymentDetail data={data?.order as Order} />
                            </TabsContent>
                        }
                    </Tabs>
                </div>
                <div className="lg:col-span-1">
                    {user?.department && canView(user.department, "delete_order") &&
                        <div className="w-full">
                            <Button className=" text-white flex gap-2 px-6 py-2 rounded-xl shadow-md transition w-full hover:bg-red-700" variant="destructive"
                                onClick={() => setDialog(true)}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Order
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>
        <Dialog open={dialog}  onOpenChange={(open) => setDialog(open)}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Order</DialogTitle>
                    <DialogDescription>Are you sure you want to delete? This cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive" onClick={() => handleDelete()}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
}

export default DetailedOrderPage