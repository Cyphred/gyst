import { Request, Response, NextFunction } from "express";
import ApiError from "./apiError.js";
import { ErrorCode } from "./errorCodes.js";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default status to 200
  let status: number = 200;
  let error: ApiError;

  if (!(err instanceof ApiError)) {
    console.error(ErrorCode.GENERIC.code, " | ", err);
    error = new ApiError(ErrorCode.GENERIC);
    status = 500;
  } else {
    error = err as ApiError;
    status = error.status;
    console.error(error.code, " | ", error.message);
  }

  return res.status(status).send({
    status: error.status,
    errorCode: error.code,
    message: error.message,
  });
};
