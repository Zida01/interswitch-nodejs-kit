import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";
import {InterSwitchCardService} from "../_lib/interswitch/services/interswitch-card.service";
import {GeneralUtils} from "../_lib/general.utils";

export class PaymentService {
    protected interSwitchCardService: InterSwitchCardService

    constructor() {
        this.interSwitchCardService = new InterSwitchCardService()
    }


    /**
     * @description Initialize payment service
     * @param reqBody
     */
    initiatePaymentService = async (reqBody: InitiatePaymentDto): Promise<IResponse<InitiatePaymentDto | null>> => {
        try {
            const reference = GeneralUtils.generateReference();

            await this.interSwitchCardService.initializeService({
                email: reqBody.email,
                amount: reqBody.amount,
                reference,
                pan: reqBody.pan,
                pin: reqBody.pin,
                cvv2: reqBody.cvv2,
                expireMonth: reqBody.expireMonth,
                expireYear: reqBody.expireYear,
            })

            return ResponseUtils.handleResponse(true, "Payment generated successfully", reqBody);

        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }
}