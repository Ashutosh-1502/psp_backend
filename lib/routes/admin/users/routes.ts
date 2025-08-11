// NPM Dependencies
import httpStatus from "http-status";
import { Response, NextFunction } from "express";

// Internal Dependencies
import { AdminUsersHelpers } from "@/routes/admin/users/helpers";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { ErrorResponse, SuccessResponse } from "@/utils/helpers/apiResponse";
import { PaginatedSearchQuery } from "@/utils/interfaces/common/query";
import { Validator } from "node-input-validator";

export class AdminUsersRoutes {
  public static get = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const query: PaginatedSearchQuery = req.query;
      const data = await AdminUsersHelpers.findAll({
        page: Number(query.page ?? 1),
        pageSize: Number(query.pageSize ?? 50),
        searchValue: String(query.searchValue ?? ""),
        companyRef: query.companyRef,
      });
      return SuccessResponse(res, httpStatus.OK, {
        message: "Data retrieved successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static getOne = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id }: { id: string } = req.params;
      const data = await AdminUsersHelpers.findOne(id);
      return SuccessResponse(res, httpStatus.OK, {
        message: "Data retrieved successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static updateStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validator = new Validator(req.body, {
        status: "required|string",
      });

      const matched = await validator.check();

      if (!matched) {
        return ErrorResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {
          message: "Validation error",
          errors: validator.errors,
        });
      }

      const id: string = req.params.id;
      const { status } = req.body;
      const { companyRef } = req.user;
      const data = await AdminUsersHelpers.updateStatus(id, companyRef, status);
      if (!data) {
        return ErrorResponse(res, httpStatus.BAD_REQUEST, {
          message: "Bad request. check the body",
        });
      }
      return SuccessResponse(res, httpStatus.OK, {
        message: "Successfully enabled or disabled User.",
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public static changeUserRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validator = new Validator(req.body, {
        role: "required|string",
        userId: "required|string",
      });

      const matched = await validator.check();

      if (!matched) {
        return ErrorResponse(res, httpStatus.UNPROCESSABLE_ENTITY, {
          message: "Validation error",
          errors: validator.errors,
        });
      }
      const companyRef: string = req.params.id;
      const { role, userId }: { role: string; userId: string } = req.body;
      const data = await AdminUsersHelpers.changeUserRole(
        userId,
        companyRef,
        role,
      );
      return SuccessResponse(res, httpStatus.OK, {
        message: "Data updated successfully.",
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
