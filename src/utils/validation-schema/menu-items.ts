
import {z} from "zod";

export const MenuItemsSchema = z.object({
    name: z.string().min(3),
    description:z.string().min(8),
    price: z.number().positive("Price must be a positive number").min(1),
    image: z.string().min(1, "Image URL cannot be empty"),
    categoryId: z.string().min(1, "Category ID cannot be empty"),
    isVegetarian: z.boolean(),
    spicyLevel: z.number().int().min(0, "Spicy level cannot be negative").max(5, "Spicy level cannot exceed 5").optional(),
    isTrending: z.boolean().optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    dietaryType: z.enum(["VEGETARIAN", "NON_VEGETARIAN"]),
})