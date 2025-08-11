import { Router } from "express";
import { AdminRouter } from "@/routes/admin/admin";
import { AuthRouter } from "@/routes/auth";
import { Middleware } from "@/middleware/auth";
import { UserRouter } from "@/routes/user";
import {AnnouncementRouter} from "@/routes/announcement"

const middleware = new Middleware();

export const api = Router();
api.use(middleware.attachTokenFromCookie);
api.use(middleware.jwtDecoder);

api.use("/admin", new AdminRouter().router);
api.use("/user", new UserRouter().router);
api.use("/announcements", new AnnouncementRouter().router);
api.use("/auth", new AuthRouter().router);
