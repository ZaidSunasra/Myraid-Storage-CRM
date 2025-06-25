import { UserProvider } from "./context/UserContext"
import Router from "./routes/routes"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <UserProvider>
        <Toaster richColors expand={true} closeButton/>
        <Router />
      </UserProvider>
    </>
  )
}

export default App
