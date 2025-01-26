import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import { MenuItemsSchema } from "../utils/validation-schema/menu-items";
import { ZodError } from "zod";
import { ValidationError } from "../utils/errorHandling/validation";
import { ErrorCode } from "../utils/errorHandling/root";
import db from "../utils/prisma";
import { NotFound } from "../utils/errorHandling/not-found";
import { UniqueConstraintError } from "../utils/errorHandling/unique-constraint-error";
import { MenuItemsQuerySchema } from "../utils/validation-schema/menu-items-query-schema";

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
       // Parse and validate input using Zod
       const validatedData = MenuItemsSchema.parse(req.body);

       // Check if the categoryId exists in the Category table
       const categoryExists = await db.category.findUnique({
         where: { id: validatedData.categoryId },
       });
   
       if (!categoryExists) {
         res.status(400).json({
           message: "Invalid categoryId. The specified category does not exist.",
           errorCode: "INVALID_CATEGORY_ID",
         });
         return
       }

    const menuItem = await db.menuItem.create({
      data: validatedData,
    });

    res.status(201).json({ message: "MenuItem Added Successfully", menuItem });
  } catch (err: any) {

//     Prisma errors can occur for many reasons:
// P2002: Unique constraint violations.
// P2003: Foreign key constraint violations.
// P2000: Value too large for column.
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
      // Extract the field causing the unique constraint violation
      const field = err.meta?.target ? err.meta.target[0] : "unknown";
      return next(new UniqueConstraintError(field));
    }
    next(err);
  }
};

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, ...data } = req.body;

    if (!id) {
      res.status(400).json({ message: "MenuItem Id is required" });
      return;
    }
    MenuItemsSchema.partial().parse(data);
    if (Object.keys(data).length === 0) {
      res.status(400).json({ message: "No field to update" });
      return;
    }
    const menuItem = await db.menuItem.findUnique({ where: { id } });

    if (!menuItem) {
      next(new NotFound("MenuItem Not Found", ErrorCode.MENUITEM_NOT_FOUND));
      return;
    }

    const updatedMenuItem = await db.menuItem.update({
      where: { id },
      data,
    });

    if (!updatedMenuItem) {
      next(new NotFound("MenuItem Not Found", ErrorCode.MENUITEM_NOT_FOUND));
      return;
    }
    res
      .status(200)
      .json({
        message: "MenuItem Updated Successfully",
        data: updatedMenuItem,
      });
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
    next(err);
  }
};

export const deleteMenuItem = async ( req: Request,
  res: Response,
  next: NextFunction) => {

    try{
      const {id}= req.params
      if(!id){
        res.status(400).json({ message: "MenuItem Id is required" });
      return;
      }

      const menuItem = await db.menuItem.findUnique({ where: { id } });

      if (!menuItem) {
        next(new NotFound("MenuItem Not Found", ErrorCode.MENUITEM_NOT_FOUND));
        return;
      }

      const deletedMenuItem = await db.menuItem.delete({
        where:{id}
      })
      res.status(200).json({message:`${deletedMenuItem.name} MenuItem deleted Successfully`})
      return
    }catch(err:any){
      // if (err.message === "Unexpected end of JSON input") {
      //   res.status(400).json({ message: "Invalid JSON in request body" });
      //   return;
      // }
      next(err)
    }

};

export const getMenuItems = async (req: Request,
  res: Response,
  next: NextFunction) => {

    try{
      const{page,limit,search} = MenuItemsQuerySchema.parse(req.query)

      const skip = (page-1)*limit

      const whereClause = search
  ? {
      name: {
        contains: search,
        mode: "insensitive" as Prisma.QueryMode, 
      },
    }
  : {};

      const [menuItems ,totalItems] =await Promise.all([
        db.menuItem.findMany({
          where: whereClause,
          skip,
          take:limit
        }),
        db.menuItem.count({
          where: whereClause,
        })
      ])

      const totalPages = Math.ceil(totalItems / limit);
      res.status(200).json({
        message: "MenuItems fetched successfully",
        data: menuItems,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      });

      

    }catch(err:any){
      if (err instanceof ZodError) {
         res.status(400).json({
          message: "Invalid query parameters",
          details: err.errors,
        });
      }
      next(err)
    }


};
