
import Navbar from "@/shared/components/Navbar"
import QuotationTable from "../component/QuotationTable"

const QuotationsPage = () => {

    return <div className="bg-accent min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col p-2 sm:p-0 sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quotations</h1>
                    <p className="text-muted-foreground">Manage your sales pipeline and track deal progress</p>
                </div>
            </div>
            <QuotationTable />
        </div>
    </div>
}

export default QuotationsPage