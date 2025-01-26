import { Router } from "express";

const menuRoutes:Router = Router()
import { authenticatedUser } from "../utils/middleware/auth";
import { createMenuItem, deleteMenuItem, getMenuItems, updateMenuItem } from "../controllers/menus";
import { adminVerify } from "../utils/middleware/admin";
import { sanitizeEmptyBody } from "../utils/middleware/sanatizeEmptyBody";

//here sequence of middleware is important for getting user from authenticatedUser
menuRoutes.post("/add",[authenticatedUser,adminVerify],createMenuItem)
menuRoutes.patch("/update",[authenticatedUser,adminVerify],updateMenuItem)
menuRoutes.delete("/delete/:id",[authenticatedUser,adminVerify],deleteMenuItem)
menuRoutes.get("/items",[authenticatedUser],getMenuItems)

export default menuRoutes;

