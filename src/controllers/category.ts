import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import db from '../utils/prisma';
import { CategorySchema } from '../utils/validation-schema/category';
import { ValidationError } from '../utils/errorHandling/validation';
import { ErrorCode } from '../utils/errorHandling/root';
import { ZodError } from 'zod';
import { UniqueConstraintError } from '../utils/errorHandling/unique-constraint-error';


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
  