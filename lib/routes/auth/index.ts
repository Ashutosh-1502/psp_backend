import { Router } from "express";
import { AuthRoutes } from "@/routes/auth/routes";

export class AuthRouter {
  router: Router;
  constructor() {
    this.router = Router();
    this.router.post("/register", AuthRoutes.register);
    this.router.post("/login", AuthRoutes.login);
    this.router.post("/logout", AuthRoutes.logout);
  }
}
