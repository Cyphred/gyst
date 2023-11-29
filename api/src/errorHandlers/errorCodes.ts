export class ErrorCode {
  static readonly GENERIC = new ErrorCode(
    "GYST9999",
    "Something went wrong",
    500
  );
  static readonly UNAUTHORIZED = new ErrorCode("GYST0001", "Unauthorized", 403);
  static readonly MISSING_AUTHENTICATION = new ErrorCode(
    "GYST0002",
    "Missing authentication",
    401
  );

  //to add, just increment the error code

  readonly code: string;
  readonly message: string;
  readonly status: number;

  private constructor(code: string, message: string, status: number) {
    this.code = code;
    this.message = message;
    this.status = status;
  }
}
