"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" aria-disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up"}
        </Button>
    );
}

const initialState = {
    success: false,
    message: "",
    error: {}
};

export default function RegisterForm() {
    const [state, dispatch] = useFormState(registerUser, initialState as any);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            toast.success("Account created! Please sign in.");
            router.push("/login");
        } else if (state?.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
                {state?.error?.name && <p className="text-xs text-red-500">{state.error.name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" required />
                {state?.error?.email && <p className="text-xs text-red-500">{state.error.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" minLength={6} required />
                {state?.error?.password && <p className="text-xs text-red-500">{state.error.password}</p>}
            </div>
            <SubmitButton />
        </form>
    );
}
