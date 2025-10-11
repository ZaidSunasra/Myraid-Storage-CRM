import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { ArrowLeft, Eye, X } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import QuotationSideBar from "../component/QuotationSideBar"
import { useEffect, useState } from "react"
import { Form } from "@/shared/components/ui/form"
import QuotationCosting from "../component/QuotationCosting"
import QuotationSummary from "../component/QuotationSummary"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuotation } from "@/context/QuotationContext"
import { addQuotationSchema, type AddQuotation } from "zs-crm-common"
import PreviewQuotationPage from "./PreviewQuotationPage"
import { FetchQuotationById } from "@/api/quotations/quotation.queries"
import ErrorDisplay from "@/shared/components/ErrorPage"
import QuotationProducts from "../component/QuotationProducts"
import QuotationProductSelector from "../component/QuotationProductSelector"
import { useEditQuotation } from "@/api/quotations/quotations.mutation"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog"
import EditPageLoader from "@/shared/components/loaders/EditPageLoader"

const EditQuotationPage = () => {

    const { id, quotation_id } = useParams()
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const { products, addProduct, clearAll} = useQuotation();
    const [dialog, setDialog] = useState<{ open: boolean; }>({ open: false });
    const navigate = useNavigate();
    const handleNext = () => setCurrentStep((step) => step + 1)
    const handlePrev = () => setCurrentStep((step) => step - 1)

    const { data, isPending, isError } = FetchQuotationById(quotation_id as string)
    const editQuotation = useEditQuotation();

    const form = useForm<AddQuotation>({
        resolver: zodResolver(addQuotationSchema),
    });

    useEffect(() => {
        if (!data?.quotation?.quotation_products) return;
        clearAll();
        const quotation_item = data.quotation.quotation_products.map((p, index) => {
            const mappedItems = p.quotation_item.map((item) => ({
                id: item.id,
                name: item.item_name,
                height: Number(item.height ?? 0),
                width: Number(item.width ?? 0),
                depth: Number(item.depth ?? 0),
                quantity: Number(item.quantity ?? 0),
                per_bay_qty: Number(item.per_bay_qty ?? 0),
                provided_rate: Number(item.provided_rate ?? 0),
                market_rate: Number(item.market_rate ?? 0),
                code: item.item_code ?? null,
                description: item.description ?? null,
                removed: false,
            }));
            const working = p.quotation_working?.[0];
            addProduct(mappedItems, p.name, working, index);
            return {
                items: mappedItems,
                id: p.id,
                name: p.name,
                powder_coating: Number(working?.powder_coating ?? 0),
                trolley_material: Number(working?.trolley_material ?? 0),
                ss_material: Number(working?.ss_material ?? 0),
                total_weight: Number(working?.total_weight ?? 0),
                labour_cost: Number(working?.labour_cost ?? 0),
                installation: Number(working?.installation ?? 0),
                accomodation: Number(working?.accomodation ?? 0),
                transport: Number(working?.transport ?? 0),
                metal_rate: working?.metal_rate ?? 0,
                total_body: Number(working?.total_body ?? 0),
                total_market_rate: Number(working?.market_total_cost ?? 0),
                total_provided_rate: Number(working?.provided_total_cost ?? 0),
                set: Number(working?.set ?? 1),
                profit_percent: Number(working?.profit_percent ?? 15),
                discount: Number(working?.discount ?? 0)
            };
        });
        form.reset({
            quotation_template: data.quotation.quotation_template,
            grandTotal: Number(data.quotation.grand_total ?? 0),
            gst: Number(data.quotation.gst ?? 0),
            round_off: Number(data.quotation.round_off ?? 0),
            show_body_table: data.quotation.show_body_table ?? false,
            note: data.quotation.note ?? null,
            quotation_item: quotation_item,
            quotation_no: data.quotation.quotation_no ?? id,
            total: data.quotation.sub_total ?? 0
        });
    }, [data, addProduct, clearAll, form]);

    const onSubmit = (data: AddQuotation) => {
        const payload = {
            ...data,
            quotation_item: products
                .map((p) => ({
                    ...p,
                    items: p.items.filter((it) => !it.removed),
                }))
                .filter((p) => p.items.length > 0),
        };
        if (payload.quotation_item.length == 0) {
            toast.error("Atleast 1 product or item required")
        } else {
            editQuotation.mutate({ data: payload, deal_id: id as string, id: quotation_id as string })
        }
    }

    if (isPending) return <EditPageLoader showSidebar={false}/>
    if (isError) return <ErrorDisplay fullPage />

    return (
        <div className="bg-accent min-h-screen">
            <Navbar />
            <div className="mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between flex-col sm:flex-row">
                        <div className="flex items-center space-x-4 mb-6">
                            <Button variant="ghost" size="icon" onClick={() => setDialog({ open: true })}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Edit Exisiting Quotation</h1>
                                <p className="text-muted-foreground">
                                    Edit an exisiting quotation in your CRM system
                                </p>
                            </div>
                        </div>
                        {!showPreview ? (
                            <Button className="mb-4 flex gap-2" onClick={() => setShowPreview(true)}>
                                <Eye className="w-4 h-4" />
                                Preview Quotation
                            </Button>
                        ) : (
                            <Button
                                variant="destructive"
                                className="mb-4 flex gap-2"
                                onClick={() => setShowPreview(false)}
                            >
                                <X className="w-4 h-4" />
                                Close Preview
                            </Button>
                        )}
                    </div>
                    {!showPreview ? (
                        <div className="flex flex-col gap-8">
                            <QuotationSideBar currentStep={currentStep} />
                            {
                                currentStep == 1 &&
                                <QuotationProductSelector />
                            }
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit, (errors) => { console.log(errors) })}>
                                    {currentStep === 1 && (
                                        <QuotationProducts handleNext={handleNext} />
                                    )}
                                    {currentStep === 2 && (
                                        <QuotationCosting
                                            form={form}
                                            handleNext={handleNext}
                                            handlePrev={handlePrev}
                                        />
                                    )}
                                    {currentStep === 3 && (
                                        <QuotationSummary form={form} handlePrev={handlePrev} isSubmitting={editQuotation.isPending} type="edit" />
                                    )}
                                </form>
                            </Form>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-xl p-4 overflow-auto">
                            <h2 className="text-lg font-semibold mb-4">Quotation Preview</h2>
                            <PreviewQuotationPage data={form.watch()} />
                        </div>
                    )}
                </div>
            </div>
            <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open, ...(open ? {} : { data: null, action: null }) }))}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Save changes</DialogTitle>
                        <DialogDescription>
                            You’ve modified this quotation. Save your changes to keep them.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => {clearAll(), navigate(`/quotation/${id}/${quotation_id}`)}}>
                                Discard Changes
                            </Button>
                        </DialogClose>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Button type="submit" disabled={editQuotation.isPending}>Save Changes</Button>
                        </form>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default EditQuotationPage