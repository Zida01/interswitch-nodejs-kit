import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";

export class PaymentService {

    /**
     * @description Initialize payment service
     * @param reqBody
     */
    initiatePaymentService = (reqBody: InitiatePaymentDto): IResponse<InitiatePaymentDto | null> => {
        try {
            return ResponseUtils.handleResponse(true, "Payment generated successfully", reqBody);
        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }
}