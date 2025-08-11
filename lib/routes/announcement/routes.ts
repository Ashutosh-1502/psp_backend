// NPM Dependencies
import status from "http-status";
import { Response, NextFunction } from "express";

// Internal Dependencies
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { AnnouncementHelpers } from "@/routes/announcement/helper";

export class AnnouncementRoutes {
  public static getAllNotifications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.log("reach backend")
      const notifications = await AnnouncementHelpers.findNotifications();

      return SuccessResponse(res, status.OK, {
        message: "Success",
        data: {notifications},
      });
    } catch (error) {
      next(error);
    }
  };

  public static managenotification = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id: string = req.params.id;
      const userId = req.params.userId;

      const data = await AnnouncementHelpers.manageNotification(id, userId);

      if (!data) {
        return ErrorResponse(res, status.NOT_FOUND, {
          message: "Notification not found",
        });
      }

      return SuccessResponse(res, status.OK, {
        message: "Success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
