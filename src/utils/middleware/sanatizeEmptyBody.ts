import { Request, Response, NextFunction } from "express";

/**
 * Middleware to sanitize empty bodies for DELETE requests.
 * If the request method is DELETE and the body is empty,
 * it clears the body to prevent unnecessary JSON parsing errors.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const sanitizeEmptyBody = (req: Request, res: Response, next: NextFunction): void => {
  // Check if the method is DELETE and the body is empty
  if (req.method === "DELETE" && req.body && Object.keys(req.body).length === 0) {
    req.body = undefined; // Clear the body to avoid JSON parsing issues
  }

  // Proceed to the next middleware or route handler
  next();
};
