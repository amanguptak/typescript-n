import {z} from "zod";

export const MenuItemsQuerySchema = z.object({
    page: z.string().optional().transform((v)=>(v? parseInt(v,10):1)),
    limit: z.string().optional().transform((v) => {
        const parsed = v ? parseInt(v, 10) : 10; // Default to 10 if not provided
        return parsed > 100 ? 100 : parsed; // Cap at 100 items per page
      }),
    search: z.string().optional(), // Search query for the name field
})