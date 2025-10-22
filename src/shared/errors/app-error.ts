export class AppError extends Error {
  public override readonly message: string;
  public readonly errorCode: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    errorCode: string,
    statusCode: number = 500
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.name = 'AppError';
    
    // This is important for proper error handling
    Error.captureStackTrace(this, AppError);
  }
}