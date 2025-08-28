import Navbar from "./Navbar"
import UnderConstruction from "@/assets/page-under-construction.svg"

const WorkInProgress = () => {
  return (
    <div className="bg-accent min-h-screen flex flex-col">
       <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
        <img src={UnderConstruction} className="w-80 h-80 mb-6" />
        <h1 className="text-2xl font-bold text-primary mb-2">
          🚧 Work In Progress 🚧
        </h1>
        <p className="text-muted-foreground text-lg">
          This page is still cooking... 🍳  
          Come back later when it’s delicious 😋
        </p>
      </div>
    </div>
  )
}

export default WorkInProgress
