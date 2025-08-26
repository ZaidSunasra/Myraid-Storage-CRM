import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useParams } from "react-router";
import { leadSchema, type AddLead, type Assignee } from "zs-crm-common";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/shared/components/ui/button";
import { FetchLeadById } from "@/api/leads/leads.queries";
import { Form } from "@/shared/components/ui/form";
import AddEditCompanyDetails from "../components/AddEditCompanyDetails";
import AddEditLeadDetails from "../components/AddEditLeadDetails";
import FormSideBar from "../../../shared/components/FormSideBar";
import { useEditLead } from "@/api/leads/leads.mutation";
import EditPageLoader from "@/shared/components/loaders/EditPageLoader";

const EditLeadPage = () => {
	const { id } = useParams();
	const { data, isPending } = FetchLeadById(id as string);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const editLead = useEditLead(id as string);

	const form = useForm<AddLead>({
		resolver: zodResolver(leadSchema),
		defaultValues: {
			company_name: "",
			gst_no: "",
			address: "",
			first_name: "",
			last_name: "",
			emails: [],
			phones: [],
			source_id: 0,
			product_id: 0,
			assigned_to: []
		}
	});

	useEffect(() => {
		if (data?.lead) {
			form.reset({
				company_name: data.lead.company.name,
				gst_no: data.lead.company.gst_no || "",
				address: data.lead.company.address,
				first_name: data.lead.client_detail.first_name,
				last_name: data.lead.client_detail.last_name,
				emails: data.lead.client_detail.emails
					?.filter((e): e is { email: string } => e.email !== null)
					.map((e) => ({ email: e.email })) || [],
				phones: data.lead.client_detail.phones
					?.map((p: { phone: string }) => ({ number: p.phone })) || [],
				source_id: data.lead.source_id,
				product_id: data.lead.product_id,
				assigned_to: data.lead.assigned_to
					.map((i: Assignee) => ({ id: i.user.id }))
			});
		}
	}, [data, form]);


	const onSubmit = async (data: AddLead) => {
		editLead.mutate({ data, id });
	};

	const handleNext = () => {
		if (currentStep < 2) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = () => {
		setCurrentStep(1);
	};

	if (isPending) return <EditPageLoader showSidebar={true}/>;

	return (
		<div className="bg-accent min-h-screen">
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
							<FormSideBar currentStep={currentStep} type="lead" />
						</div>
						<div className="lg:col-span-3">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
									{currentStep === 1 && <AddEditCompanyDetails form={form} handleClick={handleNext} />}
									{currentStep === 2 && <AddEditLeadDetails form={form} handleClick={handlePrev} isLoading={editLead.isPending} />}
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditLeadPage;
