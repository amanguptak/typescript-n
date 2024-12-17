import { Router } from "express";
import authRoutes from "./auth";
import menuRoutes from "./menu";
import categoryRoutes from "./category";

const rootRouter:Router =  Router();

rootRouter.use('/auth',authRoutes)
rootRouter.use("/menu",menuRoutes)
rootRouter.use("/category",categoryRoutes)


export default rootRouter;
