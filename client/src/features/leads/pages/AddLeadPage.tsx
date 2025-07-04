import { useUser } from "@/context/UserContext";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { leadSchema, type AddLead, type sources } from "zs-crm-common";
import FormSideBar from "../components/FormSideBar";
import AddEditCompanyDetails from "../components/AddEditCompanyDetails";
import AddEditLeadDetails from "../components/AddEditLeadDetails";
import { useAddLead } from "@/api/leads/leads.mutation";

const AddLeadPage = () => {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const { user } = useUser();
    const addLead = useAddLead();

    const form = useForm({
        resolver: zodResolver(leadSchema),
        defaultValues: ({
            first_name: "",
            last_name: "",
            emails: [{ email: "" }],
            phones: [{ number: "" }],
            description: "",
            source: "" as sources,
            product: "",
            company_name: "",
            address: "",
            gst_no: "",
            assigned_to: user?.id
        }),
    });

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrev = () => {
        setCurrentStep(1)
    }

    const onSubmit = (data: AddLead) => {
        addLead.mutate(data);
    }


    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to="/lead">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Add New Lead</h1>
                        <p className="text-muted-foreground">Create a new lead in your CRM system</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <FormSideBar currentStep={currentStep} />
                    </div>
                    <div className="lg:col-span-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {currentStep === 1 && (
                                    <AddEditCompanyDetails form={form} handleClick={handleNext} />
                                )}
                                {currentStep === 2 && (
                                    <AddEditLeadDetails form={form} handleClick={handlePrev} />
                                )}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default AddLeadPage;