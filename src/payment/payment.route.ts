// payment.routes.ts
import { Router } from "express";
import { PaymentController } from "./payment.controller";

const paymentRoutes = Router();
const controller = new PaymentController();

paymentRoutes.post("/initiate", controller.initiatePayment);

export default paymentRoutes;
