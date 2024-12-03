import { Router } from "express";
import { Login, Register } from "../controllers/auth";



const authRoutes:Router = Router()

authRoutes.post('/register',Register)
authRoutes.post('/login',Login)


export default authRoutes