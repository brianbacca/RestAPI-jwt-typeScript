import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

//reguister
export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, password } = req.body;
  try {
    //saving a new user
    const user: IUser = new User({
      username: username,
      email: email,
      password: password,
    });
    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();
    console.log("User Created -->", savedUser);

    //token
    const token: string = jwt.sign(
      { _id: savedUser._id },
      process.env.TOKEN_SECRET || "tokenTest"
    );

    return res
      .header("auth-token", token)
      .status(200)
      .json({ msg: "The user has been created" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "error at created the user" });
  }
};

//login
export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).json({ msg: "Email or password is wrong" });

  const correctPassword: boolean = await user.validtePassword(password);
  if (!correctPassword)
    return res.status(400).json({ msg: "Invalidate password" });

  const token: string = jwt.sign(
    { _id: user._id },
    process.env.TOKEN_SECRET || "tokenTest",
    {
      expiresIn: 60 * 60 * 24,
    }
  );
  res.header("auth-token", token).json(user);
};

export const profile = async (req: Request, res: Response) => {
  const user = await User.findById(req.userId, { password: 0 });
  if (!user) return res.status(400).json({ msg: "No User found" });
  res.json(user);
};
