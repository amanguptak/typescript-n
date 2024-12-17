import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../secrets";
import { UnAuthorize } from "../errorHandling/unauthorize";
import { ErrorCode } from "../errorHandling/root";

const JWT_SECRET = SECRET_KEY;
// interface CustomRequest extends Request{
//     user?: any
// }

export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return next(
        new UnAuthorize("Unauthorized - Invalid token", ErrorCode.UNAUTHORIZED)
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user information to the request object
    //          Why Not Attach to res?
    // You might wonder why we attach it to req and not res (the response object). Here's why:

    // req: Represents the incoming request. It's part of the middleware chain, so any modifications (like adding req.user) are accessible to subsequent middlewares and handlers.
    // res: Represents the outgoing response. Attaching data to res does not propagate it forward through the request lifecycle.
    req.user = decoded;
    console.log(req.user,"in mid")
    next();
  } catch (err) {
    next(
      new UnAuthorize("Unauthorized - Invalid token", ErrorCode.UNAUTHORIZED)
    );
  }
};
