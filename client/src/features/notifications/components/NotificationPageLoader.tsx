import { Skeleton } from "@/shared/components/ui/skeleton"

function NotificationPageLoader() {
  return <div className="bg-accent h-screen w-screen">
    <Skeleton className="w-full h-28 bg-background"/>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="w-full h-8 bg-background mb-4"/>
        <Skeleton className="w-full h-28 bg-background mb-4"/>
        <Skeleton className="w-full h-28 bg-background mb-4"/>
        <Skeleton className="w-full h-28 bg-background"/>
    </div>
  </div>
}

export default NotificationPageLoader