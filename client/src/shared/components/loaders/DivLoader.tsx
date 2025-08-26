import { Separator } from "../ui/separator"
import { Skeleton } from "../ui/skeleton"


const DivLoader = ({ height, showHeading }: { height: number, showHeading: boolean }) => {

    return <div className="space-y-6">
        {showHeading &&
            <>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-125 bg-background" />
                    <Skeleton className="h-6 w-120 bg-background" />
                </div>
                <Separator />
            </>
        }
        <Skeleton className={`w-full h-${height} bg-background mb-5`} />
    </div>
}

export default DivLoader