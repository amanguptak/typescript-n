import { ErrorCode, HttpError } from "./root";

export class NotFound extends HttpError {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    const data = {
      message,
      errorCode,
      statusCode: 404, // Correct key for statusCode
      errors, // Optional additional error details
    };
    super(data);
  }
}
