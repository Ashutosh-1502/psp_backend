import { Router } from "express";
import { AdminUsersRouter } from "@/routes/admin/users";
import { DashboardRouter } from "@/routes/admin/dashboard/index";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();

export class AdminRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.adminMiddleware);
    this.router.use("/user", new AdminUsersRouter().router);
    this.router.use("/dashboard", new DashboardRouter().router);
  }
}
