import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

type MobileNavigationMenuProps = {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function MobileNavigationMenu({ sidebarOpen, setSidebarOpen }: MobileNavigationMenuProps) {
    return (
        <Button
            variant="ghost"
            className="lg:hidden absolute top-4 left-4 z-50"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            <Menu className="h-6 w-6" />
        </Button>
    )
}
