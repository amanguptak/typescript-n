import { Response, Request, NextFunction } from "express";
import db from "../utils/prisma";
import { compareSync, hashSync } from "bcrypt";
import { sendToken } from "../utils/token";
import { BAD_REQUEST } from "../utils/errorHandling/bad-request";
import { ErrorCode } from "../utils/errorHandling/root";

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, phoneNumber } = req.body;
  console.log(req.body, "data otuput");

  try {
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
        phoneNumber,
      },
    });

    const { password: _, ...newUser } = user;
    res
      .status(201)
      .json({ message: "user registerd succesfully", user: newUser });
    return;
  } catch (err) {
    next(err);
    return;
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
      return next(new BAD_REQUEST("User Not Found", ErrorCode.USER_NOT_FOUND));
    }

    if (!compareSync(password, user.password)) {
      return next(new BAD_REQUEST("Wrong Credentials", ErrorCode.UNAUTHORIZED));
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

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.body;
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return next(new BAD_REQUEST("User Not Found", ErrorCode.USER_NOT_FOUND));
    }

    const { name, email, phoneNumber, profilePicture } = user;
    const userDetails = { name, email, phoneNumber, profilePicture };

    res.status(200).json({
      userDetails,
    });

    return;
  } catch (err) {
    next(err);
  }
};
