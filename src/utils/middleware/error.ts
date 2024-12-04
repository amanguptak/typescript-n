import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errorHandling/root";

export  const errorMiddleware=(error:HttpError,req:Request,res:Response,next:NextFunction)=>{
    res.status(error.statusCode).json({
        message:error.message,
        errorCode: error.errorCode,
        errors: error.errors || null,
    })

}