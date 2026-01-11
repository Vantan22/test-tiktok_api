import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <div className="hidden md:flex md:w-64 md:flex-col fixed h-full z-10">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 md:pl-64 h-full">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
