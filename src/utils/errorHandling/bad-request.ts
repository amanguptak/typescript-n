import { ErrorCode, HttpError } from "./root";

export class BAD_REQUEST extends HttpError {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    const data = {
      message,
      errorCode,
      statusCode: 400, // Correct key for statusCode
      errors, // Optional additional error details
    };
    super(data);
  }
}
