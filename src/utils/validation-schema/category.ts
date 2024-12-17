import z from "zod"
import { MenuItemsSchema } from "./menu-items"

export const CategorySchema = z.object({
    name: z
    .string()
    .min(1, "Category name cannot be empty")
    .max(50, "Category name must be at most 50 characters long"),
    items: z.array(MenuItemsSchema).optional(), 
    
})