import { Router } from "express";
import { getUser, Login, Register } from "../controllers/auth";



const authRoutes:Router = Router()

authRoutes.post('/register',Register)
authRoutes.post('/login',Login)
authRoutes.get("/me",getUser)


export default authRoutes