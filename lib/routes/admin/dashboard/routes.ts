// NPM Dependencies
import status from "http-status";
import { Response, NextFunction } from "express";

// Internal Dependencies
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { DashboardHelpers } from "@/routes/admin/dashboard/helper";
import { DashboardType } from "@/utils/interfaces/module/dashboard";

export class DashboardRoutes {
  public static getAllDashboardDetails = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const [userDetails, notifications, sequences] = await Promise.all([
        DashboardHelpers.findUsers(),
        DashboardHelpers.findNotifications(),
        DashboardHelpers.findSequences(),
      ]);

      return SuccessResponse(res, status.OK, {
        message: "Success",
        data: { userDetails, notifications, sequences },
      });
    } catch (error) {
      next(error);
    }
  };

  public static manageUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {operation} = req.body;
      const id: string = req.params.id;
      const data = await DashboardHelpers.manageUser(id, operation);

      if (!data) {
        return ErrorResponse(res, status.NOT_FOUND, {
          message: "User not found",
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

  public static newAnnouncement = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const notification: DashboardType = req.body;

      const data = await DashboardHelpers.newAnnouncement(notification);
      if (!data){
        return ErrorResponse(res, status.NOT_FOUND, {
          message: "Notification not found",
        });
      }

      return SuccessResponse(res, status.OK, {
        message: "Success",
        data,
      });
    } catch (error) {
      next(error)
    }
  }

  public static managenotification = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const notification: DashboardType = req.body;
      const id: string = req.params.id;
      const userId = req.params.notificationId

      const data = await DashboardHelpers.manageNotification(id, notification, userId);

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
