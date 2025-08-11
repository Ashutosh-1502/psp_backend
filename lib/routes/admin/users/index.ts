// NPM Deps
import { Router } from "express";

// Internal Deps
import { AdminUsersRoutes } from "@/routes/admin/users/routes";
import { Middleware } from "@/middleware/auth";
export class AdminUsersRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(new Middleware().adminMiddleware);
    this.router
      .get("/", AdminUsersRoutes.get)
      .get("/:id", AdminUsersRoutes.getOne);
    this.router.put("/status/:id", AdminUsersRoutes.updateStatus);
    this.router.put("/user-role/:id", AdminUsersRoutes.changeUserRole);
  }
}
