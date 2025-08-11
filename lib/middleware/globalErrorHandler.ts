import { NextFunction, Response } from "express";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import status from "http-status";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { ERROR_TYPE } from "@/utils/interfaces/module/errorLog";
import { ErrorLogs } from "@/db/models/errorLogs";

const SENSITIVE_FIELDS = ["password", "token", "authorization"];

// Function to sanitize data
function sanitizeData(data: any): any {
  if (!data) return data;

  const sanitized = { ...data };

  // Hide common sensitive fields
  SENSITIVE_FIELDS.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
}

// Async function to log error
export async function logError(
  err: any,
  errorType: ERROR_TYPE,
  req?: AuthenticatedRequest,
) {
  try {
    const stackTrace = err.stack?.split("\n").slice(0, 100).join("\n");
    const statusCode = status.INTERNAL_SERVER_ERROR;

    // Create error document
    const errorLog = new ErrorLogs({
      // Basic Error Information
      name: err.name,
      message: err.message,
      stackTrace,
      type: errorType,

      // Request Context
      ...(req && {
        request: {
          method: req.method,
          statusCode,
          url: req.originalUrl,
          path: req.route?.path,
          headers: sanitizeData(req.headers),
          query: sanitizeData(req.query),
          params: sanitizeData(req.params),
          body: sanitizeData(req.body),
        },
      }),

      // User Context
      ...(req?.user && {
        context: {
          userRef: req.user._id,
          userAgent: req.get("user-agent"),
          ip: req.ip,
        },
      }),
    });

    errorLog.save().catch((saveErr) => {
      console.error("Error saving error log:", saveErr);
    });
  } catch (loggingError) {
    console.error("Error in error logging:", loggingError);
  }
}

export function globalErrorHandler(
  err: Error,
  req: AuthenticatedRequest,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  // Start error logging asynchronously
  logError(err, ERROR_TYPE.GENERIC, req);

  return ErrorResponse(res, status.INTERNAL_SERVER_ERROR, {
    message: err.message,
  });
}
