import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useParams } from "react-router";
import { leadSchema, type AddLead, type sources } from "zs-crm-common";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { fetchLeadById } from "@/api/leads/leads.queries";
import { Form } from "@/shared/components/ui/form";
import AddEditCompanyDetails from "../components/AddEditCompanyDetails";
import AddEditLeadDetails from "../components/AddEditLeadDetails";
import FormSideBar from "../components/FormSideBar";
import { useEditLead } from "@/api/leads/leads.mutation";

const EditLeadPage = () => {

    const { id } = useParams();
    const { data, isPending } = fetchLeadById(id || "");
    const [currentStep, setCurrentStep] = useState<number>(1);
    const editLead = useEditLead(id || "");

    const form = useForm({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            company_name: data?.lead.company.name,
            gst_no: data?.lead.company.gst_no,
            address: data?.lead.company.address,
            first_name: data?.lead.client_detail.first_name,
            last_name: data?.lead.client_detail.last_name,
            emails: data?.lead.client_detail.email?.map((e: any) => ({ email: e.email })) || [],
            phones: data?.lead.client_detail.phone?.map((p: any) => ({ number: p.phone })) || [],
            source: data?.lead.source as sources,
            product: data?.lead.product,
            description: data?.lead.description || "",
            assigned_to: data?.lead.assigned_to,
        },
    })

    const onSubmit = async (data: AddLead) => {
        editLead.mutate({ data, id });
    }

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrev = () => {
        setCurrentStep(1)
    }

    const onError = (error: any) => {
        console.log(error)
    }

    if (isPending) {
        return <>Loading...</>
    }

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex items-center space-x-4 mb-6">
                    <NavLink to={`/lead/${id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </NavLink>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Edit New Lead</h1>
                        <p className="text-muted-foreground">Edit an existing lead in your CRM system</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
                    <div className="lg:col-span-1">
                        <FormSideBar currentStep={currentStep} />
                    </div>
                    <div className="lg:col-span-3">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
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

export default EditLeadPage; 