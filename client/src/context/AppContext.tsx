import { type ReactNode } from "react"
import { UserProvider } from "./UserContext"
import { NotificationProvider } from "./NotificationContext"
import { QuotationProvider } from "./QuotationContext"
import { PermissionProvider } from "./PermissionContext"

export const AppContext = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <PermissionProvider>
        <NotificationProvider>
          <QuotationProvider>
            {children}
          </QuotationProvider>
        </NotificationProvider>
      </PermissionProvider>
    </UserProvider>
  )
}
