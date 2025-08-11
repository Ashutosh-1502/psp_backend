// NPM Deps
import { Router } from "express";

// Internal Deps
import { DashboardRoutes } from "@/routes/admin/dashboard/routes";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();
export class DashboardRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.adminMiddleware);
    this.router.get("/dashboard-details", DashboardRoutes.getAllDashboardDetails);
    this.router.post("/new-announcement", DashboardRoutes.newAnnouncement);
    this.router.post("/manage-users/:id", DashboardRoutes.manageUser)
    this.router.post("/manage-notifications/:id/:userId", DashboardRoutes.managenotification);
  }
}
