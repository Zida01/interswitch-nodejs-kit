import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";
import {InterSwitchCardService} from "../_lib/interswitch/services/interswitch-card.service";
import {GeneralUtils} from "../_lib/general.utils";
import prisma from "../_lib/db/prisma";
import {IPaymentInitializeResp} from "./payment.type";
import {AuthenticateOtpDto} from "./dto/authenticate-otp.dto";
import {InvoiceLogRepository} from "../invoice/invoice-log.repository";

export class PaymentService {
    protected interSwitchCardService: InterSwitchCardService
    protected invoiceLogRepository: InvoiceLogRepository

    constructor() {
        this.interSwitchCardService = new InterSwitchCardService()
        this.invoiceLogRepository = new InvoiceLogRepository()
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
                    payment_status: initializeResp.status ? 'pending' : 'failed',
                    gateway_reference: initializeResp.data?.gateway_reference
                }
            })

            if (initializeResp.status && initializeResp.data) {
                await this.invoiceLogRepository.createInvoiceLog({
                    reference,
                    req_payload: initializeResp.data.reqBody,
                    resp_payload: initializeResp.data.respData,
                    is_successful: initializeResp.status,
                    action_type: initializeResp.data.next_action
                })
                return ResponseUtils.handleResponse(true, "Payment generated successfully", {
                    reference,
                    message: initializeResp.data?.message as string,
                    next_action: initializeResp.data?.next_action as string,
                });
            }

            await this.invoiceLogRepository.createInvoiceLog({
                reference,
                req_payload: JSON.stringify(initializeResp.data?.reqBody ?? null),
                resp_payload: JSON.stringify(initializeResp.data?.respData ?? null),
                is_successful: false,
                action_type: 'initiate',
            })

            return ResponseUtils.handleResponse(false, initializeResp.message, null);

        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }

    /**
     *
     * @param reqBody
     */
    authenticateOtpService = async (reqBody: AuthenticateOtpDto): Promise<IResponse<null>> => {
        try {
            const invoice = await prisma.invoice.findFirst({where: {reference: reqBody.reference}})

            if (!invoice) {
                return ResponseUtils.handleResponse(false, "Invalid Reference", null);
            }

            const verifyResp = await this.interSwitchCardService.otpVerification(reqBody.reference, invoice.gateway_reference as string, reqBody.otp)

            await this.invoiceLogRepository.createInvoiceLog(
                {
                    reference: reqBody.reference,
                    req_payload: verifyResp.data?.reqBody,
                    resp_payload: verifyResp.data?.respData,
                    is_successful: true,
                    action_type: verifyResp.data?.next_action as string
                }
            );

            return ResponseUtils.handleResponse(true, "OTP verified successfully", null);

        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }
}