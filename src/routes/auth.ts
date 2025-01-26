import { Router } from "express";
import { getUser, Login, Logout, Register } from "../controllers/auth";
import { authenticatedUser } from "../utils/middleware/auth";



const authRoutes:Router = Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "supersecret"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation or user already exists)
 */

authRoutes.post('/register',Register)
authRoutes.post('/login',Login)
authRoutes.get("/me/:id",authenticatedUser,getUser)
authRoutes.post("/logout",authenticatedUser,Logout)


export default authRoutes