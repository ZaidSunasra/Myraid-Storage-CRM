import { useNavigate } from 'react-router'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'

const MangeSourceOrProduct = ({ type }: { type: "sources" | "products" }) => {

    const navigate = useNavigate();

    return <Button variant="outline" className="w-full mt-2" onClick={() => navigate(`/setting?section=${type}`)}>
        <Plus />
        {type === "sources" ? "Add Source" : "Add Product"}
    </Button>

}

export default MangeSourceOrProduct;