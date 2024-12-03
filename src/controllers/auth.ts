import { Response, Request } from "express";
import db from "../utils/prisma";
import { compareSync, hashSync } from "bcrypt";
import { sendToken } from "../utils/token";

export const Register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phoneNumber } = req.body;
  console.log(req.body, "data otuput");

  try {
    let user = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (user) {
      res.status(400).json({ message: "User Already Exists" });
      return;
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
    console.log(err);
    res.status(500);
    return;
  }
};

export const Login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    if (!compareSync(password, user.password)) {
      res.status(400).json({ message: "Wrong Details" });
      return;
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
