interface IHttpError {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors ?: any;
}

export class HttpError extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: any;

  constructor({ message, errorCode, statusCode, errors }: IHttpError) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}


export enum ErrorCode {
    // User-related errors
    USER_NOT_FOUND = 404,               // Resource not found
    USER_ALREADY_EXISTS = 409,          // Conflict (e.g., duplicate user)
    INCORRECT_PASSWORD = 401,           // Unauthorized (invalid credentials)
  
    // Address-related errors
    ADDRESS_NOT_FOUND = 404,            // Resource not found
    ADDRESS_DOES_NOT_BELONG = 403,      // Forbidden (access violation)
  
    // Validation and semantic errors
    UNPROCESSABLE_ENTITY = 422,         // Validation error (semantic issue)
  
    // Server-side errors
    INTERNAL_EXCEPTION = 500,           // Internal server error
    UNAUTHORIZED = 401,                 // Unauthorized (authentication required)
  
    // Product-related errors
    PRODUCT_NOT_FOUND = 404,            // Resource not found
  
    // Order-related errors
    ORDER_NOT_FOUND = 404,              // Resource not found
  }
  

//   export enum ErrorCode {
//     USER_NOT_FOUND = 1001,
//     USER_ALREADY_EXISTS = 1002,
//     INCORRECT_PASSWORD = 1003,
//     ADDRESS_NOT_FOUND = 1004,
//     ADDRESS_DOES_NOT_BELONG = 1005,
//     UNPROCESSABLE_ENTITY = 2001,
//     INTERNAL_EXCEPTION= 3001,
//     UNAUTHORIZED = 4001,

//     PRODUCT_NOT_FOUND = 5001,

//     ORDER_NOT_FOUND = 6001,
// }
