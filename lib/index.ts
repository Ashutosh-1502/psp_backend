import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import status from "http-status";
import { api } from "@/routes/api";
import envConfig from "@/utils/configuration/environment";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import { requestTimeout } from "@/middleware/requestTimeout";
import { globalErrorHandler } from "@/middleware/globalErrorHandler";
import rateLimiter from "@/middleware/rateLimiter";
import helmet from "helmet";
import { corsOptions } from "@/utils/configuration/corsOptions";
import apiConfig from "@/utils/configuration/api";
import cookieParser from "cookie-parser";

export const createApp = (): Application => {
  try {
    const app = express();

    /**
     * ---------------------------------
     *            Middlewares
     * ---------------------------------
     */

    app.use(helmet());

    app.use(cors(corsOptions));

    app.use(
      express.urlencoded({
        extended: true,
        limit: apiConfig.API_MAX_URL_ENCODED_SIZE,
      }),
    );

    app.use(rateLimiter);

    // Apply timeout middleware AFTER webhooks but BEFORE regular routes

    app.use(requestTimeout({ timeout: envConfig.REQUEST_TIMEOUT }));

    app.use(cookieParser());

    app.use(express.json({ limit: apiConfig.API_MAX_PAYLOAD_SIZE })); // Parsers for POST data

    app.use(compression()); // for gzipping the request

    // ------ End Of Middlewares --------

    app.use("/api", api); // route prefix

    // Error handling routes
    app.all("*", (req, res) => {
      return ErrorResponse(res, status.NOT_FOUND, {
        message: "Route Not Found",
      });
    });

    app.use(globalErrorHandler); // Global Error handler for logging requests

    return app;
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};
