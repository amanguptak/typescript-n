import { Router } from "express";

const categoryRoutes:Router = Router()
import { authenticatedUser } from "../utils/middleware/auth";

import { adminVerify } from "../utils/middleware/admin";
import { createCategory } from "../controllers/category";

//here sequence of middleware is important for getting user from authenticatedUser
categoryRoutes.post("/add",authenticatedUser,adminVerify,createCategory)

export default categoryRoutes;

