"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need textarea? Prompt listed input/label/select. Textarea is not in list but needed for notes? I'll use Shadcn Textarea if installed, or Input.
// Prompt said "npx shadcn-ui@latest add ...". Textarea WAS NOT in the list.
// "npx shadcn-ui@latest add input label select table tabs badge dropdown-menu skeleton toast"
// No textarea. I'll use standard <textarea> with tailwind classes or install textarea.
// I'll stick to <Input> or simple <textarea>. The prompt "Notes (optional, textarea)".
// I'll use <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
import { addChannelSchema } from "@/lib/validations";
import { addChannel } from "@/app/actions/channels";
import { toast } from "sonner";

type FormData = z.infer<typeof addChannelSchema>;

export function AddChannelDialog() {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(addChannelSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const result = await addChannel(data);
            if (result.success) {
                toast.success("Channel added successfully");
                setOpen(false);
                reset();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Channel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Channel</DialogTitle>
                    <DialogDescription>
                        Enter the TikTok username of the channel you want to track.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="username"
                                placeholder="tiktok"
                                {...register("username")}
                                className={errors.username ? "border-red-500" : ""}
                            />
                            {errors.username && (
                                <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="groupName" className="text-right">
                            Group
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="groupName"
                                placeholder="Marketing, Competitors..."
                                {...register("groupName")}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tags" className="text-right">
                            Tags
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="tags"
                                placeholder="fashion, tech (comma separated)"
                                {...register("tags")}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="notes" className="text-right mt-2">
                            Notes
                        </Label>
                        <div className="col-span-3">
                            <textarea
                                id="notes"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Internal notes..."
                                {...register("notes")}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Channel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
