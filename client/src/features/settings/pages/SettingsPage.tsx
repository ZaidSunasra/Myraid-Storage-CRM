import { Navigate, useSearchParams } from "react-router"
import SideBar from "../components/SideBar"
import { menuItems } from "../config/menuItems"
import { useUser } from "@/context/UserContext"
import type { department } from "zs-crm-common"

const SettingsPage = () => {

    const { user } = useUser()
    const [searchParams, setSearchParams] = useSearchParams()
    const allowedItems = menuItems.filter(item =>
        item.roles.includes(user?.department as department)
    );
    const defaultSection = allowedItems[0]?.id
    const sectionFromUrl = searchParams.get("section")
    const isValidSection = allowedItems.some(item => item.id === sectionFromUrl)
    const activeSection = isValidSection ? sectionFromUrl : defaultSection
    const ActiveComponent = allowedItems.find(item => item.id === activeSection)?.component;

    if (!isValidSection && defaultSection) {
        return <Navigate to={`?section=${defaultSection}`} replace />
    }

    const handleSectionChange = (id: string) => {
        if (allowedItems.some(item => item.id === id)) {
            setSearchParams({ section: id })
        }
    }

    return (
        <div className="bg-accent min-h-screen flex">
            <SideBar activeSection={activeSection as string} onSectionChange={handleSectionChange} />
            <div className="flex-1 p-4 overflow-x-auto">
                {ActiveComponent && <ActiveComponent />}
            </div>
        </div>
    )
}

export default SettingsPage
