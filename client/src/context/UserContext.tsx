import { createContext, useContext, useState, type ReactNode } from "react";
import { DEPARTMENTS } from "zs-crm-common";

type User = { name: string; email: string; department: (typeof DEPARTMENTS)[number]; id: number; code?: string };

type UserContextType = { user: User | null; setUser: (user: User) => void; clearUser: () => void };

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUserState] = useState<User | null>(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const setUser = (user: User) => {
		setUserState(user);
		localStorage.setItem("user", JSON.stringify(user));
	};

	const clearUser = () => {
		setUserState(null);
		localStorage.removeItem("user");
	};

	return <UserContext.Provider value={{ user, setUser, clearUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
