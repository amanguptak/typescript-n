import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import db from '../utils/prisma';
import { categoryIdSchema, CategorySchema } from '../utils/validation-schema/category';
import { ValidationError } from '../utils/errorHandling/validation';
import { ErrorCode } from '../utils/errorHandling/root';
import { ZodError } from 'zod';
import { UniqueConstraintError } from '../utils/errorHandling/unique-constraint-error';
import { NotFound } from '../utils/errorHandling/not-found';


export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Parse and validate input using Zod
      const validatedData = CategorySchema.parse(req.body);
  
      // Check if a category with the same name already exists
      const existingCategory = await db.category.findUnique({
        where: { name: validatedData.name },
      });
  
      if (existingCategory) {
         res.status(409).json({
          message: "Category with this name already exists.",
          errorCode: "CATEGORY_DUPLICATE",
        });
        return
      }

  
      // Create the category if it doesn't exist
      const category = await db.category.create({
        data: {
          name: validatedData.name,
        },
      });
  
      res.status(201).json({ message: "Category created successfully", category });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return next(
          new ValidationError(
            err.errors,
            "Validation Error",
            ErrorCode.UNPROCESSABLE_ENTITY
          )
        );
      }
      if (err.code === "P2002") {
        const field = err.meta?.target ? err.meta.target[0] : "unknown";
        return next(new UniqueConstraintError(field));
      }
      next(err);
    }
  };
  

  export const updateCategory = async(req:Request,res:Response,next:NextFunction)=>{
    try{

      const {id , ...data} = req.body
    
      if (!id) {
        res.status(400).json({ message: "Category Id is required" });
        return;
      }
      const validatedData = CategorySchema.partial().parse(data)
  
      const categoryExits = db.category.findUnique({
        where:{id}
      })
  
      if(!categoryExits){
        next(new NotFound("Category Not Found", ErrorCode.MENUITEM_NOT_FOUND));
        return;
      }
  
      const updatedCategory = await db.category.update({
        where: {id},
        data: validatedData
      })
  
      res.status(200).json({
          message:"Category Updated Successfully.",
          data:updatedCategory
  
      })
    }catch(err){
      if (err instanceof ZodError) {
        return next(
          new ValidationError(
            err.errors,
            "Validation Error",
            ErrorCode.UNPROCESSABLE_ENTITY
          )
        );
      }
      next(err);
    }
  }

  export const getMenuByCategory = async(req:Request,res:Response,next:NextFunction)=>{
    try{

     const menuByCategory = await db.category.findMany({
      include:{
        items:{
          where:{status:"ACTIVE"},
          select:{
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            isVegetarian: true,
            spicyLevel: true,
            isTrending: true
          }
        }
      }
     })

     res.status(201).json(menuByCategory)

    }catch(err){
      next(err)
    }
  }


  export const getCategories = async(req:Request,res:Response,next:NextFunction)=>{

     try{
      const categories = await db.category.findMany()
      res.status(200).json(categories)
     }catch(err){
      next(err)
     }

  }

  export const deleteCategory = async(req:Request,res:Response,next:NextFunction)=>{

     try{
       const { id } = categoryIdSchema.parse(req.params);

     if(!id){
      res.status(400).json({message:"Please Provide Category Id"})
      return
     }

     const  findCategory = await db.category.findUnique({
      where:{
        id: id
      }
     })
     if(!findCategory){
      next(new NotFound("Category Not Found", ErrorCode.CATEGORY_NOT_FOUND));
      return;
     }

     const deletedCategory = await db.category.delete({
      where:{
        id
      }
     })
      res.status(200).json({message:`${deletedCategory} Deleted SuccessFully`})
     }catch(err){
      if (err instanceof ZodError) {
        return next(
          new ValidationError(
            err.errors,
            "Validation Error",
            ErrorCode.UNPROCESSABLE_ENTITY
          )
        );
      }
      next(err)
     }
  }