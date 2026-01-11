import LoginForm from "@/components/auth/login-form";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign in to NIUSDAY</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <LoginForm />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("tiktok");
                    }}
                >
                    <Button variant="outline" className="w-full" type="submit">
                        Sign in with TikTok
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
