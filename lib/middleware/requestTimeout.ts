import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/helpers/appError";
import status from "http-status";

interface TimeoutOptions {
  timeout?: number;
  errorMessage?: string;
}

export const requestTimeout = (options: TimeoutOptions = {}) => {
  const {
    timeout = 60000,
    errorMessage = "Request timeout: Operation took too long to complete",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        next(new AppError(errorMessage, status.REQUEST_TIMEOUT));
      }
    }, timeout);

    // Clear timeout when response is sent
    res.once("finish", () => {
      clearTimeout(timeoutId);
    });

    // Clear timeout if request is closed/aborted
    res.once("close", () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};
