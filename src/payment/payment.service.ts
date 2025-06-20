import {InitiatePaymentDto} from "./dto/initiate-payment.dto";
import {IResponse, ResponseUtils} from "../_lib/response.utils";
import {LoggerUtils} from "../_lib/logger.utils";
import {InterSwitchCardService} from "../_lib/interswitch/services/interswitch-card.service";
import {GeneralUtils} from "../_lib/general.utils";
import {IPaymentInitializeResp} from "./payment.type";
import {AuthenticateOtpDto} from "./dto/authenticate-otp.dto";
import {InvoiceRepository} from "../invoice/repository/invoice.repository";
import {Invoice} from "@prisma/client";
import {InvoiceLogRepository} from "../invoice/repository/invoice-log.repository";

export class PaymentService {
    protected interSwitchCardService: InterSwitchCardService
    protected invoiceLogRepository: InvoiceLogRepository
    protected invoiceRepository: InvoiceRepository

    constructor() {
        this.interSwitchCardService = new InterSwitchCardService()
        this.invoiceLogRepository = new InvoiceLogRepository()
        this.invoiceRepository = new InvoiceRepository()
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


            //Create Invoice and it logs
            await this.invoiceRepository.createInvoice({
                reference,
                email: reqBody.email,
                channel: 'card',
                amount: reqBody.amount,
                payment_status: initializeResp.status ? 'pending' : 'failed',
                gateway_reference: initializeResp.data?.gateway_reference
            })
            await this.invoiceLogRepository.createInvoiceLog({
                reference,
                req_payload: initializeResp.data?.reqBody,
                resp_payload: initializeResp.data?.respData,
                is_successful: initializeResp.status,
                action_type: initializeResp.data?.next_action as string
            })


            return ResponseUtils.handleResponse(initializeResp.status,
                initializeResp.message, {
                    reference,
                    message: initializeResp.data?.message ?? '',
                    next_action: initializeResp.data?.next_action ?? '',
                });


        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }

    /**
     * @description authenticate otp
     * @param reqBody
     */
    authenticateOtpService = async (reqBody: AuthenticateOtpDto): Promise<IResponse<null>> => {
        try {
            const invoice = await this.invoiceRepository.getInvoiceByReference(reqBody.reference)

            if (!invoice) {
                return ResponseUtils.handleResponse(false, "Invalid Reference", null);
            }

            //Verify transaction
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

            if(verifyResp.status){
               await this.verifyTransactionService(reqBody.reference)
            }

            return ResponseUtils.handleResponse(true, "Transaction Process successfully", null);

        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }


    /**
     * @description verify transaction service
     * @param reference
     * @param invoice
     */
    verifyTransactionService = async (reference:string,invoice?:Invoice|null): Promise<IResponse<any>> => {
        try {

            if(!invoice){
                invoice = await this.invoiceRepository.getInvoiceByReference(reference)
            }

            if (!invoice) {
                return ResponseUtils.handleResponse(false, "Invalid Reference", null);
            }

            const amount = Number(invoice.amount)

            const transVerifyResp = await this.interSwitchCardService.confirmTransactionStatus(invoice.reference, amount)

            if(transVerifyResp.status && transVerifyResp.data){
               await this.invoiceRepository.updateInvoice(reference,{
                    payment_status:transVerifyResp.data.payment_status,
                    paid_at : transVerifyResp.data.payment_date ?? null
                })
            }

            await this.invoiceLogRepository.createInvoiceLog({
                reference,
                req_payload: null,
                resp_payload: transVerifyResp.data,
                is_successful: false,
                action_type: "transaction_confirmation"
            })

            return ResponseUtils.handleResponse(true, "Transaction verified successfully", {
                reference,
                payment_status: transVerifyResp.data?.payment_status ?? invoice.payment_status,
            });

        } catch (err) {
            LoggerUtils.error(err)
            return ResponseUtils.handleResponse(false, "Failed to process request", null);
        }
    }
}