
import { Router } from "express";
import { PaymentController } from "./payment.controller";
import {validate} from "../_lib/common/middleware/validation.middleware";
import {initiatePaymentSchema} from "./dto/initiate-payment.dto";

const paymentRoutes = Router();
const controller = new PaymentController();

paymentRoutes.post("/initiate", validate(initiatePaymentSchema), controller.initiatePayment);

export default paymentRoutes;
