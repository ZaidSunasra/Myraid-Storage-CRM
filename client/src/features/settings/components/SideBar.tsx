import { useUser } from "@/context/UserContext"
import { menuItems } from "../config/menuItems"
import { Badge } from "@/shared/components/ui/badge"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/shared/components/ui/sidebar"
import { ChevronLeft, Settings } from "lucide-react"
import { useNavigate } from "react-router"
import { navItems } from "@/utils/getNavigationLink"
import type { department } from "zs-crm-common"

interface SideBarProps {
    activeSection: string
    onSectionChange: (sectionId: string) => void,
}

const SideBar = ({ activeSection, onSectionChange }: SideBarProps) => {

    const { user } = useUser();
    const navigate = useNavigate();

    const accessibleMenuItems = menuItems.filter(item =>
        item.roles.some(role => user?.department.includes(role))
    )

    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarProvider>
                <Sidebar variant="sidebar" collapsible="icon" className="border-r border-gray-200">
                    <SidebarHeader className="border-b border-gray-200">
                        <SidebarMenuButton>
                            <Settings className=" text-black-500 font-bold" />
                            <h2 className="text-lg font-semibold">Settings</h2>
                        </SidebarMenuButton>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {accessibleMenuItems.map((item) => (
                                        <SidebarMenuItem key={item.id}>
                                            <SidebarMenuButton
                                                isActive={activeSection === item.id}
                                                onClick={() => onSectionChange(item.id)}
                                                tooltip={item.description}
                                            >
                                                <item.icon />
                                                <span>{item.name}</span>
                                                {item.badge && (
                                                    <Badge variant="outline" className="ml-auto text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter className="border-t border-gray-200">
                        <SidebarMenuButton onClick={() => navigate(navItems[user?.department as department][0].url)}>
                            <ChevronLeft />
                            <span>Back</span>
                        </SidebarMenuButton>
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <SidebarTrigger />
            </SidebarProvider>
        </div>
    )
}

export default SideBar