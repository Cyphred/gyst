import { Request, Response, NextFunction } from "express";
import UserModel, { User } from "../models/user.js";
import genericOkResponse from "../common/genericOkResponse.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, name } = req.body as User;

    // Create the user
    const user = await UserModel.signup({ username, password, name });

    return genericOkResponse(res, user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;

    // Fetch a matching user
    const user = await UserModel.findOne({ username }, { password: 1 });

    // Prepare the invalid credentials error
    const invalidCredentialsError = new ApiError(ErrorCode.INVALID_CREDENTIALS);

    // Reject if the user does not exist
    if (!user) throw invalidCredentialsError;

    // Check if the passwords match
    const passwordsMatch = await bcryptjs.compare(password, user.password);

    // Reject if the passwords don't match
    if (!passwordsMatch) throw invalidCredentialsError;

    // Get jwt secret from .env
    const jwtSecret = process.env.JWT_SECRET;

    // Create a token valid for 7 days
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "7d",
    });

    const returnUser = await UserModel.findOne({ _id: user._id });

    return genericOkResponse(res, { user: returnUser, token });
  } catch (err) {
    next(err);
  }
};
