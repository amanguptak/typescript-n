import { NextFunction, Request, Response } from "express";
import { UnAuthorize } from "../errorHandling/unauthorize";
import { ErrorCode } from "../errorHandling/root";

export const adminVerify =(req:Request,res:Response,next:NextFunction)=>{
    const user= req.user
    console.log(user,"check-user")

    if(user.role ==="ADMIN"){
        next()
    }else{
        next(
            new UnAuthorize("Unauthorized", ErrorCode.UNAUTHORIZED)
          );
    }
}