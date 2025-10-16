import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Avatar } from "@/shared/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { BellIcon, LogOutIcon, Menu, User, X } from "lucide-react";
import { useLogout } from "@/api/auth/auth.mutation";
import { useNotifications } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import { navItems } from "@/utils/getNavigationLink";

const Navbar = () => {

	const { user } = useUser();
	const department = user?.department;

	const [menuOpen, setMenuOpen] = useState(false);
	const logout = useLogout();
	const { unreadCount } = useNotifications();
	const navigate = useNavigate();

	const onSubmit = () => {
		logout.mutate();
	};

	return (
		<nav className="bg-background">
			<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
				<div className="flex  h-16  justify-between">
					<div className="flex h-full gap-8">
						<div className="flex-shrink-0 flex items-center">
							<span className=" text-xl font-bold text-primary cursor-pointer"> Myraid Storage</span>
						</div>
						<div className="hidden lg:flex sm:space-x-8 ">
							{navItems[department!].map((item) => (
								<NavLink
									key={item.url}
									to={item.url}
									className={({ isActive }) =>
										`inline-flex items-center  px-1 pt-1 border-b-2 text-sm font-medium ${isActive ? "border-accent-foreground text-primary" : "border-transparent text-muted-foreground hover:border-accent-foreground hover:text-primary"}`
									}
								>
									{item.title}
								</NavLink>
							))}
						</div>
					</div>
					<div className="flex gap-4 h-full items-center">
						<div className="relative" onClick={() => navigate("/notifications")}>
							<BellIcon className="h-6 w-6 text-gray-700" />
							{unreadCount > 0 && <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-destructive text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">{unreadCount}</div>}
						</div>
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
								<DropdownMenuItem onClick={() => navigate("/profile")}>
									<User className="h-5 w-5" />
									<span>Profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onSubmit}>
									<LogOutIcon className="h-5 w-5" />
									<span>Sign Out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="lg:hidden h-8 w-8 flex items-center">
							<button onClick={() => setMenuOpen(!menuOpen)} className="text-primary focus:outline-none">
								{menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
							</button>
						</div>
					</div>
				</div>
				{menuOpen && (
					<div className="lg:hidden flex flex-col space-y-2 pb-4">
						{navItems[department!].map((item) => (
							<NavLink
								key={item.url}
								to={item.url}
								onClick={() => setMenuOpen(false)}
								className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? "text-accent-foreground font-semibold" : "text-muted-foreground hover:text-primary hover:bg-accent"}`}
							>
								{item.title}
							</NavLink>
						))}
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
