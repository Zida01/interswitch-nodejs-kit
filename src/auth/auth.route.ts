// payment.routes.ts
import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();
const controller = new authController();

authRoutes.post("/register", controller.Register);
authRoutes.post("/login", controller.Login)

authRoutes.get("/r", () => {
    console.log("welcome")
});

export default authRoutes;
