import { NextFunction, Request, Response } from "express";
import { z } from "zod";
// we can create something like this as well  for not writing code in every file

//and after that we use like below
/*
import express from "express";
import { validate } from "../middleware/zodMiddleware";
import { categoryIdSchema } from "../validators/categoryValidator";
import { deleteCategory } from "../controllers/categoryController";

const router = express.Router();

router.delete("/:id", validate(categoryIdSchema), deleteCategory);


*/

// Generic Zod validation middleware
export const validate = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body); // For body validation
    req.params = schema.parse(req.params); // For params validation
    req.query = schema.parse(req.query); // For query validation
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.errors.map((e) => e.message).join(", ") });
    } else {
      next(err);
    }
  }
};

/*
issue with above approch
❌ Issues With This Approach
Unnecessary Parsing:

It validates all three parts (body, params, query) even if you only need one, which is inefficient.
Conflicting Schemas:

If you pass a schema intended for body, it will incorrectly try to validate params and query, causing unintended errors.
Less Readable:

It's less clear which part of the request you're validating. With the source parameter, it's explicit.
✅ Conclusion
✔ Use the flexible version with source: "body" | "params" | "query" = "body" because it's more efficient, flexible, and clean.
✔ It prevents unnecessary validations and clearly communicates the intent of each middleware call.

*/

// ulternate and bettar approch


export enum RequestSource {
    BODY = "body",
    PARAMS = "params",
    QUERY = "query",
  }
  
  export const validate2 = (schema: z.ZodSchema, source: RequestSource = RequestSource.BODY) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req[source] = schema.parse(req[source]); // Validate and parse only the required part
        next();
      } catch (err) {
        if (err instanceof z.ZodError) {
          res.status(400).json({ message: err.errors.map((e) => e.message).join(", ") });
        } else {
          next(err);
        }
      }
    };
  };
  
/*

req[source] = schema.parse(req[source]);
✅ Explanation:
req[source]:

req is the Request object from Express.js.
source is a variable that can be either "body", "params", or "query" (based on your enum or string union).
Using req[source] is a way to dynamically access the property of req based on the value of source.
If source is "body", it's equivalent to req.body.
If source is "params", it's equivalent to req.params.
If source is "query", it's equivalent to req.query.
schema.parse(req[source]):

schema.parse() is a Zod method that validates and parses the provided data according to the defined Zod schema.
If the validation succeeds, the parsed data is returned.
If the validation fails, Zod throws a ZodError.
Assignment (=):

The parsed and validated data is reassigned to the corresponding part of the req object.
For example, if you're validating req.body, after validation, req.body will contain the validated and potentially transformed data.

** use in route for 2nd approch
// routes/categoryRoutes.ts
import express from "express";
import { deleteCategory } from "../controllers/categoryController";
import { validate, RequestSource } from "../middleware/validate";
import { categoryIdSchema } from "../validators/categoryValidator";

const router = express.Router();

// Validate URL params
router.delete("/:id", validate(categoryIdSchema, RequestSource.PARAMS), deleteCategory);

// Validate request body
router.post("/", validate(categoryIdSchema, RequestSource.BODY), createCategory);

// Validate query parameters
router.get("/", validate(categoryIdSchema, RequestSource.QUERY), getCategories);

export default router;


benfits Clean controller

// controllers/categoryController.ts
import { Request, Response, NextFunction } from "express";

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Validation already done by middleware

    const findCategory = await db.category.findUnique({
      where: { id },
    });

    if (!findCategory) {
      return next(new NotFound("Category Not Found", ErrorCode.CATEGORY_NOT_FOUND));
    }

    const deletedCategory = await db.category.delete({
      where: { id },
    });

    res.status(200).json({ deletedCategory, message: "Category Deleted Successfully" });
  } catch (err) {
    next(err); // Pass any unexpected errors to the error handler
  }
};



*/