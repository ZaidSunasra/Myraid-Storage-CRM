import { useState } from "react";
import { NavLink } from "react-router";
import { Avatar } from "@/shared/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Menu, User, X } from "lucide-react";

const Navbar = () => {

    const navItems = [
        {
            title: "Leads",
            url: "/lead"
        },
        {
            title: "Deals",
            url: "/deal"
        },
        {
            title: "Quotation",
            url: "/quotation"
        },
        {
            title: "Orders",
            url: "/order"
        },
        {
            title: "Settings",
            url: "/setting"
        }
    ];

    const [menuOpen, setMenuOpen] = useState(false);

    return <nav className="bg-background">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex  h-16  justify-between">
                <div className="flex h-full gap-8">
                    <div className="flex-shrink-0 flex items-center">
                        <span className=" text-xl font-bold text-primary cursor-pointer"> Myraid Storage</span>
                    </div>
                    <div className="hidden sm:flex sm:space-x-8 ">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.url}
                                to={item.url}
                                className={({ isActive }) =>
                                    `inline-flex items-center  px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                        ? "border-accent-foreground text-primary"
                                        : "border-transparent text-muted-foreground hover:border-accent-foreground hover:text-primary"
                                    }`
                                }
                            >
                                {item.title}
                            </NavLink>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 h-full items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="flex justify-center items-center cursor-pointer">
                                <User className="h-5 w-5" />
                                <span className="sr-only">User menu</span>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="sm:hidden h-8 w-8 flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-primary focus:outline-none">
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="sm:hidden flex flex-col space-y-2 pb-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.url}
                            to={item.url}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? "text-accent-foreground font-semibold"
                                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                                }`
                            }
                        >
                            {item.title}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    </nav >

}

export default Navbar;