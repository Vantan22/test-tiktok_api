import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import { auth } from "@/auth";

export async function Header() {
    const session = await auth();

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px] lg:px-6">
            <MobileSidebar />
            <div className="w-full flex-1">
                {/* Placeholder for search or breadcrumbs */}
            </div>
            {session?.user ? (
                <UserNav user={session.user} />
            ) : (
                <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse" />
            )}
        </header>
    );
}
