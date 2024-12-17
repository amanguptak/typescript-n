import { Response, Request, NextFunction } from "express";
import db from "../utils/prisma";
import { compareSync, hashSync } from "bcrypt";
import { sendToken } from "../utils/token";
import { BAD_REQUEST } from "../utils/errorHandling/bad-request";
import { ErrorCode } from "../utils/errorHandling/root";
import { RegisterSchema } from "../utils/validation-schema/user";
import { ValidationError } from "../utils/errorHandling/validation";
import { ZodError } from "zod";
import { NotFound } from "../utils/errorHandling/not-found";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    RegisterSchema.parse(req.body);
    const { name, email, password, phone } = req.body;
    let user = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      return next(
        new BAD_REQUEST("User Already Exists", ErrorCode.USER_ALREADY_EXISTS)
      );
    }
    user = await db.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
        phone,
      },
    });
    const { password: passwordHash, role: userRole, ...newUser } = user;

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
    return;
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

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(new NotFound("User Not Found", ErrorCode.USER_NOT_FOUND));
    }

    if (!compareSync(password, user.password)) {
      return next(new NotFound("Wrong Credentials", ErrorCode.UNAUTHORIZED));
    }

    const data = {
      req,
      res,
      user,
      statusCode: 200,
    };

    sendToken(data);
  } catch (err) {
    console.log(err);
  }
};


export const Logout = async(req:Request,res:Response,next:NextFunction)=>{
  try{
    res.clearCookie("authToken", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      // sameSite: "strict", // Adjust based on your requirements
      // path: "/", // Ensure the path matches where the cookie was set
    });

    res.status(200).json({ message: "Logged out successfully" });
  }catch(err){
    next(err)
  }

}

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return next(new NotFound("User Not Found", ErrorCode.USER_NOT_FOUND));
    }

    const { name, email, phone } = user; // Register function

    const userDetails = { name, email, phone };

    res.status(200).json(userDetails);

    return;
  } catch (err) {
    console.log(err);
    next(err);
  }
};
