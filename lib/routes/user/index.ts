import { Router } from "express";
import { UserRoutes } from "@/routes/user/routes";
import { Middleware } from "@/middleware/auth";

const middleware = new Middleware();

export class UserRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.use(middleware.authMiddleware);
    this.router.get("/me", UserRoutes.me);
  }
}
