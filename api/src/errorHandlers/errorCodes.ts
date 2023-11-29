export class ErrorCode {
  static readonly GENERIC = new ErrorCode(
    "GYST9999",
    "Something went wrong",
    500
  );
  static readonly UNAUTHORIZED = new ErrorCode("GYST0001", "Unauthorized", 401);
  static readonly MISSING_AUTHENTICATION = new ErrorCode(
    "GYST0002",
    "Missing authentication",
    401
  );
  static readonly INVALID_TOKEN = new ErrorCode(
    "GYST0003",
    "Invalid token",
    401
  );
  static readonly CATEGORY_NOT_FOUND = new ErrorCode(
    "GYST0004",
    "Category not found",
    404
  );
  static readonly EXPENSE_NOT_FOUND = new ErrorCode(
    "GYST0005",
    "Expense not found",
    404
  );
  static readonly TRACKER_NOT_FOUND = new ErrorCode(
    "GYST0006",
    "Tracker not found",
    404
  );
  static readonly USERNAME_IN_USE = new ErrorCode(
    "GYST0007",
    "Username is already in use",
    409
  );
  static readonly INVALID_CREDENTIALS = new ErrorCode(
    "GYST0008",
    "Invalid username/password",
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
