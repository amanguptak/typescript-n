import { Router } from "express";

const menuRoutes:Router = Router()
import { authenticatedUser } from "../utils/middleware/auth";
import { createMenuItem } from "../controllers/menus";
import { adminVerify } from "../utils/middleware/admin";

//here sequence of middleware is important for getting user from authenticatedUser
menuRoutes.post("/add",authenticatedUser,adminVerify,createMenuItem)

export default menuRoutes;

