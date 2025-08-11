import { Response, NextFunction } from "express";
import status from "http-status";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import envConfig from "@/utils/configuration/environment";
import { User } from "@/db/models/user";

export class UserRoutes {
  static JWT_SECRET: string = envConfig.JWT_SECRET;

  public static me = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        return ErrorResponse(res, status.UNAUTHORIZED, { message: "Error." });
      } else {
        // tracking the user last activity time
        await User.findByIdAndUpdate(req.user._id, {
          lastActivity: Date.now(),
        });
        return SuccessResponse(res, status.OK, {
          message: "Success.",
          data: req.user,
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
