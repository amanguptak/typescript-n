import { PrismaError } from "./prisma-error";
import { ErrorCode } from "./root";

export class UniqueConstraintError extends PrismaError {
  constructor(field: string, message = "Unique constraint violation", errors?: any) {
    super(
      `${message}: ${field}`,
      ErrorCode.UNIQUE_CONSTRAINT_VIOLATION,
      409, // HTTP status code for Conflict
      { field, ...errors }
    );
  }
}
