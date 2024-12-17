import { Request, Response, NextFunction } from "express";
import { MenuItemsSchema } from "../utils/validation-schema/menu-items";
import { ZodError } from "zod";
import { ValidationError } from "../utils/errorHandling/validation";
import { ErrorCode } from "../utils/errorHandling/root";
import db from "../utils/prisma";

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    MenuItemsSchema.parse(req.body);
    
    const menuItem = await db.menuItem.create({
      data: req.body,
    });

    res.status(201).json({ message: "MenuItem Added Successfully", menuItem });
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
