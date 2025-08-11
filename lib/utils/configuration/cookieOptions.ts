import envConfig from "@/utils/configuration/environment";
import { ENV } from "@/utils/enums/enums";
import { CookieOptions } from "express";

/**
 * Configuration options for cookies.
 *
 * @constant {Object} cookieOptions
 * @property {boolean} httpOnly - Ensures the cookie is accessible only via HTTP(S) requests, preventing client-side JavaScript access.
 * @property {boolean} secure - Determines if the cookie should only be sent over HTTPS. Enabled in production mode.
 * @property {"strict" | "lax" | "none"} sameSite - Controls cross-site request behavior. "strict" prevents cookies from being sent with cross-site requests.
 * @property {string} path - Specifies the URL path where the cookie is available. "/" makes it accessible throughout the site.
 */
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConfig.NODE_ENV === ENV.PRODUCTION,
  sameSite: "strict",
  path: "/", // Ensures cookie is available throughout the site
};
