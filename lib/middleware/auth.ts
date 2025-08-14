import httpStatus from "http-status";
import { User } from "@/db/models/user";
import envConfig from "@/utils/configuration/environment";
import { ErrorResponse } from "@/utils/helpers/apiResponse";
import { AuthenticatedRequest } from "@/utils/interfaces/common/authenticatedRequest";
import { Response, NextFunction } from "express";
import { COOKIE_NAME, STATUS, USER_TYPE } from "@/utils/enums/enums";
import { verifyToken } from "@/utils/helpers/commonHelper";
import { cookieOptions } from "@/utils/configuration/cookieOptions";

export class Middleware {
  JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = envConfig.JWT_SECRET;
  }

  public attachTokenFromCookie = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies?.[COOKIE_NAME.TOKEN];
      if (!token && req.headers.authorization) {
        req.headers.authorization = `Bearer ${token}`;
      }
      next();
    } catch (error) {
      return this.sendForbiddenAccessResponse(res);
    }
  };

  public authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const tokenFromCookie = req.cookies?.token;
      const authHeader = req.headers.authorization;

      if (!tokenFromCookie && !authHeader) {
        return this.sendForbiddenAccessResponse(res);
      }
      next();
    } catch (err) {
      return this.sendForbiddenAccessResponse(res);
    }
  };

  public jwtDecoder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.cookies && req.cookies.token;

      if (!token) {
        return next();
      }

      const decoded = await verifyToken(token);

      const user = await User.findOne({
        $and: [{ _id: decoded.data._id }],
      });

      if (!user) {
        return this.sendForbiddenAccessResponse(res);
      }

      if (user.status === STATUS.INACTIVE) {
        res.clearCookie(COOKIE_NAME.TOKEN, cookieOptions);
        return ErrorResponse(res, httpStatus.UNAUTHORIZED, {
          message: "Invalid Token",
        });
      }

      req.user = user;
      req.token = decoded;
      next();
    } catch (error) {
      res.clearCookie(COOKIE_NAME.TOKEN, cookieOptions);
      return ErrorResponse(res, httpStatus.UNAUTHORIZED, {
        message: "Invalid Token",
      });
    }
  };

  public superAdminMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || req.user.roles !== USER_TYPE.SUPER_ADMIN) {
      return this.sendForbiddenAccessResponse(res);
    }
    next();
  };

  public adminMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || req.user.roles === USER_TYPE.USER) {
      return this.sendForbiddenAccessResponse(res);
    }
    // Admin and super admin should be able to access the admin api
    if ([USER_TYPE.SUPER_ADMIN, USER_TYPE.ADMIN].includes(req.user.roles)) {
      // Adding companyRef in case super admin wants to access admin apis
      if (req.user.roles === USER_TYPE.SUPER_ADMIN)
        req.user.companyRef = req.query.companyRef || req.body.companyRef;

      next();
    } else {
      return this.sendForbiddenAccessResponse(res);
    }
  };

  public systemMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user || req.user.roles !== USER_TYPE.SYSTEM) {
      return this.sendForbiddenAccessResponse(res);
    }
    next();
  };

  private sendForbiddenAccessResponse(res: Response) {
    return ErrorResponse(res, httpStatus.UNAUTHORIZED, {
      message: "Forbidden Access",
    });
  }
}
