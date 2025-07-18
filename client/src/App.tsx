import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import Router from "./routes/routes";
import { Toaster } from "sonner";

function App() {
	return (
		<>
			<UserProvider>
				<NotificationProvider>
					<Toaster richColors expand={true} closeButton />
					<Router />
				</NotificationProvider>
			</UserProvider>
		</>
	);
}

export default App;
