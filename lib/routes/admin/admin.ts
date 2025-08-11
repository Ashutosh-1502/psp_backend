import { Router } from "express";
import { AdminUsersRouter } from "@/routes/admin/users";
import { DashboardRouter } from "@/routes/admin/dashboard/index";

export class AdminRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use("/user", new AdminUsersRouter().router);
    this.router.use("/dashboard", new DashboardRouter().router);
  }
}
