import { useDeletePayment } from "@/api/orders/orders.mutation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, DollarSign, Edit, Trash2, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import EditPayment from "./EditPayment";
import { calculateRemainingBalance } from "../utils";
import type { Order } from "zs-crm-common";

const OrderPaymentDetail = ({ data }: { data: Order }) => {

    const { order_id } = useParams()
    const [dialog, setDialog] = useState<{ open: boolean; data: any; action: "edit" | "delete" | null }>({ open: false, data: null, action: null });
    const deletePayment = useDeletePayment(order_id as string);

    const onDelete = () => {
        deletePayment.mutate(dialog.data, {
            onSuccess: () => setDialog({ open: false, data: null, action: null })
        });
    }

    const { remainingBalance } = calculateRemainingBalance(data);

    return (
        <Card className="cursor-pointer">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Payment History</span>
                </CardTitle>
                <CardDescription>All transactions</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {data.advance.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                <CreditCard className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-foreground">No payments yet</p>
                            <p className="text-xs text-muted-foreground">Add the first payment using the button above.</p>
                        </div>
                    ) : (
                        data.advance.map((advance: any) => (
                            <div key={advance.id} className="rounded-lg border border-border/50 bg-white/60 hover:bg-white transition-colors">
                                <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-6">
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green-600" />
                                                <div>
                                                    <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                                        Amount
                                                    </Label>
                                                    <p className="font-semibold text-foreground">{advance.advance_amount}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="h-4 w-4 text-blue-600" />
                                                <div>
                                                    <Label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                                        Date
                                                    </Label>
                                                    <p className="font-medium text-foreground">{format(advance.advance_date, "dd MM yyyy")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="md:hidden" />
                                    <div className="flex items-center gap-2 md:self-start">
                                        <Button variant="outline" size="sm" className="h-8 px-3 bg-white/70 hover:bg-white" onClick={() => setDialog({ open: true, data: advance, action: "edit" })}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Payment
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-8 px-3 bg-red-50 border-red-200 text-red-700" onClick={() => setDialog({ open: true, data: advance.id, action: "delete" })}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-around items-center gap-3 rounded-md">
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4 text-blue-600" />
                    <span>
                        <span className="text-foreground font-semibold">Total:</span>{" "}
                        ₹{data.balance}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span>
                        <span className="text-foreground font-semibold">Paid:</span>{" "}
                        ₹{data.balance - remainingBalance}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-medium text-muted-foreground">
                    <Wallet className="h-4 w-4 text-blue-600" />
                    <span>
                        <span className="text-foreground font-semibold">Remaining:</span>{" "}
                        ₹{remainingBalance}
                    </span>
                </div>
            </CardFooter>
            <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {dialog.action == "delete" ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Delete Payment</DialogTitle>
                                <DialogDescription>Are you sure you want to delete? This cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="destructive" onClick={() => onDelete()}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        </>
                    ) : dialog.action === "edit" ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Edit Payment</DialogTitle>
                                <DialogDescription>Update the details of the payment.</DialogDescription>
                            </DialogHeader>
                            <EditPayment data={dialog.data} setDialog={setDialog} />
                        </>
                    ) : (
                        <></>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default OrderPaymentDetail