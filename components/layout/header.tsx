import { MobileSidebar } from "./mobile-sidebar";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <div className="flex items-center p-4 border-b h-16 bg-white dark:bg-gray-900 shadow-sm">
            <MobileSidebar />
            <div className="flex w-full justify-end">
                <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
