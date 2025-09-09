import { AppContext } from "./context/AppContext";
import Router from "./routes/routes";
import { Toaster } from "sonner";

function App() {
	return <AppContext>
		<Toaster richColors expand={true} closeButton />
		<Router />
	</AppContext>
}

export default App;
