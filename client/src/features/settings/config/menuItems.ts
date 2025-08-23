import { Users, Building2, ShieldCheck, Briefcase, FileText } from "lucide-react"
import { type LucideIcon } from "lucide-react"
import type { department } from "zs-crm-common"
import ProductSettings from "../pages/ProductSettings"
import SourceSettings from "../pages/SourceSettings"
import RoleSettings from "../pages/RoleSettings"
import UserSettings from "../pages/UserSettings"
import CompanySettings from "../pages/CompanySettings"

export interface MenuItem {
    id: string
    name: string
    description: string
    icon: LucideIcon
    component: React.ComponentType
    roles: department[]
    badge?: string
}

export const menuItems: MenuItem[] = [
    {
        id: "users",
        name: "User Management",
        description: "Manage system users",
        icon: Users,
        component: UserSettings,
        roles: ["admin"]
    },
    {
        id: "company",
        name: "Company",
        description: "Configure company details",
        icon: Building2,
        component: CompanySettings,
        roles: ["admin", "sales"]
    },
    {
        id: "roles",
        name: "Role & Permissions",
        description: "Manage user roles",
        icon: ShieldCheck,
        component: RoleSettings,
        roles: ["admin"]
    },
    {
        id: "products",
        name: "Products",
        description: "Manage products",
        icon: Briefcase,
        component: ProductSettings,
        roles: ["admin", "sales"]
    },
    {
        id: "sources",
        name: "Sources",
        description: "Manage sources",
        icon: FileText,
        component: SourceSettings,
        roles: ["admin", "sales"]
    }
]