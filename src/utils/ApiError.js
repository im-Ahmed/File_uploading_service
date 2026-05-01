export class ApiError extends Error {
  constructor(
    errorCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.errorCode = errorCode;
    this.errors = errors;
    ((this.data = null), (this.success = false));
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

