import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NavLink, useParams } from "react-router";
import QuotationSideBar from "../component/QuotationSideBar";
import { useState } from "react";
import { Form } from "@/shared/components/ui/form";
import QuotationProductSelector from "../component/QuotationProductSelector";
import QuotationCosting from "../component/QuotationCosting";
import QuotationSummary from "../component/QuotationSummary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuotation } from "@/context/QuotationContext";
import { useAddQuotation } from "@/api/quotations/quotations.mutation";
import { addQuotationSchema, type AddQuotation } from "zs-crm-common";

const AddQuotationPage = () => {

    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const { items, totalBodies, totalMarketRate, totalProvidedRate } = useQuotation();
    const addQuotation = useAddQuotation();

    const form = useForm<AddQuotation>({
        resolver: zodResolver(addQuotationSchema),
        defaultValues: ({
            quotation_template: undefined,
            product_type: undefined,
            bay: 1,
            compartment: 4,
            quotation_item: items,
            powder_coating: 0,
            sheet_material: 0,
            trolley_material: 0,
            total_weight: 0,
            labour_cost: 0,
            accomodation: 0,
            transport: 0,
            installation: 0,
            metal_rate: 0,
            total: 0,
            gst: 18,
            grandTotal: 0,
            discount: 0,
            total_body: 0,
            total_market_rate: 0,
            total_provided_rate: 0,
            round_off: 0,
        }),
    });

    const handleNext = () => {
        setCurrentStep((step) => step + 1)
    }

    const handlePrev = () => {
        setCurrentStep((step) => step - 1)
    }

    const onSubmit = (data: AddQuotation) => {
        const payload = {
            ...data,
            quotation_item: items,
            total_body: totalBodies,
            total_market_rate: totalMarketRate,
            total_provided_rate: totalProvidedRate,
        }
        console.log(payload)
        addQuotation.mutate({data: payload, deal_id:id as string})
    }

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to={`/deal/${id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Add New Quotation</h1>
                        <p className="text-muted-foreground">Create a new quotation in your CRM system</p>
                    </div>
                </div>
                <div className="flex flex-col  gap-8">
                    <QuotationSideBar currentStep={currentStep} />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {currentStep === 1 && <QuotationProductSelector form={form} handleNext={handleNext} />}
                            {currentStep === 2 && <QuotationCosting form={form} handleNext={handleNext} handlePrev={handlePrev} />}
                            {currentStep === 3 && <QuotationSummary form={form} handlePrev={handlePrev} />}
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    </div >
};


export default AddQuotationPage