import { type ReactNode } from "react"
import { UserProvider } from "./UserContext"
import { NotificationProvider } from "./NotificationContext"
import { QuotationProvider } from "./QuotationContext"

export const AppContext = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <NotificationProvider>
        <QuotationProvider>
          {children}
        </QuotationProvider>
      </NotificationProvider>
    </UserProvider>
  )
}
