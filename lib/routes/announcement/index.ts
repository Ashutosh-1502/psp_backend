// NPM Deps
import { Router } from "express";

// Internal Deps
import { AnnouncementRoutes } from "@/routes/announcement/routes";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();
export class AnnouncementRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.authMiddleware);
    this.router.get("/", AnnouncementRoutes.getAllNotifications);
    this.router.post("/manage-announcements/:id/:userId", AnnouncementRoutes.managenotification);
  }
}
