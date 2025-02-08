import { Router } from "express";

const categoryRoutes:Router = Router()
import { authenticatedUser } from "../utils/middleware/auth";

import { adminVerify } from "../utils/middleware/admin";
import { createCategory, getMenuByCategory, updateCategory } from "../controllers/category";

//here sequence of middleware is important for getting user from authenticatedUser
categoryRoutes.post("/add",[authenticatedUser,adminVerify],createCategory)
categoryRoutes.patch("/update" ,[authenticatedUser,adminVerify],updateCategory)
categoryRoutes.get("/get-menu",getMenuByCategory)

export default categoryRoutes;

