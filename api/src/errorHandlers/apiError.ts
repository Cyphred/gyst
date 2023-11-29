import { ErrorCode } from "./errorCodes.js";

export default class ApiError extends Error {
  status: number;
  code: string;

  constructor(errorCode: ErrorCode = ErrorCode.GENERIC) {
    super(errorCode.message);
    this.status = errorCode.status;
    this.code = errorCode.code;
  }
}
