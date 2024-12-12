import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errorHandling/root";

export  const errorMiddleware=(error:HttpError,req:Request,res:Response,next:NextFunction)=>{
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || "An unexpected error occurred.",
        errorCode: error.errorCode || "UNKNOWN_ERROR", // Default error code
        errors: error.errors || null, // Default to null if no additional errors are provided
      });

}