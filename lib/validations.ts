import { z } from "zod";

export const addChannelSchema = z.object({
    username: z
        .string()
        .min(1, "Username is required")
        .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots and underscores"),
    groupName: z.string().optional(),
    tags: z.string().optional(), // Comma separated string from UI
    notes: z.string().optional(),
});

export const updateChannelSchema = z.object({
    groupName: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional(),
});

export const searchFilterSchema = z.object({
    search: z.string().optional(),
    groupName: z.string().optional(),
    minFollowers: z.number().min(0).optional(),
    maxFollowers: z.number().min(0).optional(),
    sortBy: z.enum(["followers", "engagement", "date"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});
