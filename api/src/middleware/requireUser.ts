import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import ApiError from "../errorHandlers/apiError.js";
import { ErrorCode } from "../errorHandlers/errorCodes.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract authentication header
    let auth: string = req.header("Authorization");

    // If the authentication header isn't a bearer token
    if (!auth || !auth.startsWith("Bearer "))
      throw new ApiError(ErrorCode.MISSING_AUTHENTICATION);

    // Split the bearer token to extract the jwt
    const token = auth.split(" ")[1];

    // If there is no token attached or is improperly formatted
    if (!token) throw new ApiError(ErrorCode.MISSING_AUTHENTICATION);

    // Decode the token and extract the user _id
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string | undefined;
    };

    // Fetch user data using _id
    const user = await UserModel.findOne({ _id: userId });

    // If there was no matching user
    if (!user) throw new ApiError(ErrorCode.UNAUTHORIZED);

    // Attach user document to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      error = new ApiError(ErrorCode.INVALID_TOKEN);

    next(error);
  }
};
