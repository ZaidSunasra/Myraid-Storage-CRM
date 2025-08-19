import Navbar from "@/shared/components/Navbar"
import { Button } from "@/shared/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { NavLink } from "react-router"
import AddCompanyDetails from "../components/AddCompanyDetails"
import { Form } from "@/shared/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dealSchema, type AddDeal } from "zs-crm-common"
import FormSideBar from "@/shared/components/FormSideBar"
import { useState } from "react"
import AddDealDetails from "../components/AddDealDetails"
import { useAddDeal } from "@/api/deals/deal.mutation"

const AddDealPage = () => {

    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const addDeal = useAddDeal();

    const handleNext = () => {
        setCurrentStep(2);
    }

    const handlePrev = () => {
        setCurrentStep(1);
    }

    const onSubmit = (data: AddDeal) => {
        addDeal.mutate(data)
    }

    const form = useForm<AddDeal>({
        resolver: zodResolver(dealSchema),
        defaultValues: ({
            company_id: "",
            employee_id: "",
            source_id: undefined,
            product_id: undefined,
            deal_status: "pending",
            assigned_to: [],
        }),
    });

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to="/deal">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Add New Deal</h1>
                        <p className="text-muted-foreground">Create a new deal in your CRM system</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <FormSideBar currentStep={currentStep} type="deal" />
                    </div>
                    <div className="lg:col-span-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {currentStep == 1 && <AddCompanyDetails form={form} handleNext={handleNext}/>}
                                {currentStep == 2 && <AddDealDetails form={form} handlePrev = {handlePrev} isLoading={addDeal.isPending}/>}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AddDealPage;