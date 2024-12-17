import { Router } from "express";
import { getUser, Login, Logout, Register } from "../controllers/auth";
import { authenticatedUser } from "../utils/middleware/auth";



const authRoutes:Router = Router()

authRoutes.post('/register',Register)
authRoutes.post('/login',Login)
authRoutes.get("/me/:id",authenticatedUser,getUser)
authRoutes.post("/logout",authenticatedUser,Logout)


export default authRoutes