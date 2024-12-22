import { HttpError } from "./root";
import { ErrorCode } from "./root";

export class PrismaError extends HttpError {
  constructor(message: string, errorCode: ErrorCode, statusCode: number, errors?: any) {
    super({ message, errorCode, statusCode, errors });
  }
}
