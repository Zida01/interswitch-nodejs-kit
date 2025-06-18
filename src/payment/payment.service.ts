import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";
import {InterSwitchCardService} from "../_lib/interswitch/services/interswitch-card.service";
import {GeneralUtils} from "../_lib/general.utils";
import prisma from "../_lib/db/prisma";
import {IPaymentInitializeResp} from "./payment.type";

export class PaymentService {
    protected interSwitchCardService: InterSwitchCardService

    constructor() {
        this.interSwitchCardService = new InterSwitchCardService()
    }


    /**
     * @description Initialize payment service
     * @param reqBody
     */
    initiatePaymentService = async (reqBody: InitiatePaymentDto): Promise<IResponse<IPaymentInitializeResp | null>> => {
        try {
            const reference = GeneralUtils.generateReference();

            const initializeResp = await this.interSwitchCardService.initializeService({
                email: reqBody.email,
                amount: reqBody.amount,
                reference,
                pan: reqBody.pan,
                pin: reqBody.pin,
                cvv2: reqBody.cvv2,
                expireMonth: reqBody.expireMonth,
                expireYear: reqBody.expireYear,
            })



            await prisma.invoice.create({
                data: {
                    reference,
                    email: reqBody.email,
                    channel: 'card',
                    amount: reqBody.amount,
                    payment_status : initializeResp.status? 'pending': 'failed',
                    gateway_reference: initializeResp.data?.gateway_reference
                }
            })

            if (initializeResp.status && initializeResp.data) {

                await prisma.invoiceLog.create({
                    data: {
                        reference,
                        req_payload: JSON.stringify(initializeResp.data.reqBody),
                        resp_payload: JSON.stringify(initializeResp.data.respData),
                        is_successful: true,
                        action_type: 'initiate',
                    }
                })

                return ResponseUtils.handleResponse(true, "Payment generated successfully", {
                    reference,
                    message: initializeResp.data?.message as string,
                    next_action: initializeResp.data?.next_action as string,
                });
            }

            await prisma.invoiceLog.create({
                data: {
                    reference,
                    req_payload: JSON.stringify(initializeResp.data?.reqBody??null),
                    resp_payload: JSON.stringify(initializeResp.data?.respData??null),
                    is_successful: false,
                    action_type: 'initiate',
                }
            })
            return ResponseUtils.handleResponse(false, initializeResp.message, null);


        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }

    // verifyOtpService = async (reqBody: InitiatePaymentDto): Promise<IResponse<IPaymentInitializeResp | null>> => {
    //     try {
    //
    //
    //
    //
    //
    //
    //
    //     } catch (err) {
    //         LoggerUtils.error(err)
    //         return ResponseUtils.handleResponse(false, "Failed to process request", null);
    //     }
    // }
}