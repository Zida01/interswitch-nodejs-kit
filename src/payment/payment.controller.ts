import {Response, Request} from "express";
import {PaymentService} from "./payment.service";
import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";


export class PaymentController {

    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    /**
     * @description : Initiate payment
     * @param req
     * @param res
     */
    initiatePayment = (req: Request<{},{},InitiatePaymentDto>, res: Response) => {
        try {
            const result = this.paymentService.initiatePaymentService(req.body);
            res.status(200).json(result);
        } catch (err) {
            LoggerUtils.error(err)
            res.status(400).json(ResponseUtils.handleResponse(false,"Unable to process request",null));
        }
    };
}