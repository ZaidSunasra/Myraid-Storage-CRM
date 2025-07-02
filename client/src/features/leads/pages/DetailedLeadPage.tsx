import { NavLink, useParams } from "react-router";
import LeadDetails from "../components/LeadDetails";
import LeadScheduling from "../components/LeadScheduling";
import { fetchLeadById } from "@/api/leads/leads.queries";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Edit } from "lucide-react";
import LeadDescription from "../components/LeadDescription";
import LeadSideBar from "../components/LeadSidebar";
import Navbar from "@/shared/components/Navbar";

const DetailedLeadPage = () => {

  const { id } = useParams();
  const { data, isPending, isError } = fetchLeadById(id || "")

  if (isPending) {
    return <div>Loading</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  return <div className="min-h-screen bg-accent">
    <Navbar />
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-between mb-6 ">
          <div className="flex items-center space-x-4">
            <NavLink to="/lead">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </NavLink>
            <div>
              <h1 className="text-2xl font-bold ">{data.lead.first_name} {data.lead.last_name}</h1>
              <p className="text-gray-600">
                {data.lead.company.name}
              </p>
            </div>
          </div>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Lead
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-background">
              <TabsTrigger value="info">Lead Information</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="space-y-6">
              <LeadDetails data={data.lead} />
              <LeadDescription data={data.lead.description} id={data.lead.id} />
            </TabsContent>
            <TabsContent value="scheduling" className="space-y-6">
              <LeadScheduling />
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-1">
          <LeadSideBar />
        </div>
      </div>
    </div>
  </div>
}

export default DetailedLeadPage;