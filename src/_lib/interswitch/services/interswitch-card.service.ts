import {LoggerUtils} from "../../logger.utils";
import axios from "axios";
import * as path from 'path';
import {
    IAuthenticateOtpReq,
    IAuthenticateOtpResp,
    ICardMakePaymentResp,
    InitializeCardPaymentReq
} from "../interswitch.interface";
import {IResponse, ResponseUtils} from "../../response.utils";
import {
    IPaymentInitializeData,
    IPaymentInitializeServiceResp, IPaymentServiceResp
} from "../../../payment/payment.type";

const generateAuthData = require(
    path.resolve(__dirname, '../../../../authData.js'),
);

export class InterSwitchCardService {

    private tokenUrl = 'https://apps.qa.interswitchng.com/passport/oauth/token';
    private baseUrl = 'https://qa.interswitchng.com/api/v3/purchases';
    private confirm_status_url = 'https://qa.interswitchng.com/collections/api/v1/gettransaction';
    private readonly clientId: string = ''
    private readonly clientSecret: string = ''
    private readonly merchantCode: string = ''

    constructor() {
        this.clientId = process.env.ISW_CLIENT_ID as string
        this.clientSecret = process.env.ISW_CLIENT_SECRET as string
        this.merchantCode = process.env.ISW_MERCHANT_CODE as string
    }

    generateTokenService = async ():Promise<string> => {
        try {
            const myString = `${this.clientId}:${this.clientSecret}`;
            const token = btoa(myString);
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${token}`,
                },
            };
            const tokenResp = await axios.post(
                this.tokenUrl,
                {grant_type: 'client_credentials'},
                config,
            );
            if (tokenResp.status && tokenResp.data.access_token) {
                return tokenResp.data.access_token;
            }
            return '';
        } catch (e) {
            LoggerUtils.error(e)
            return ''
        }
    };



    /**
     * @description Make a purchase request
     * @param paymentData
     */
    initializeService = async (paymentData: IPaymentInitializeData): Promise<IResponse<IPaymentInitializeServiceResp<InitializeCardPaymentReq,ICardMakePaymentResp>|null>> => {
        try {
            const token = await this.generateTokenService()

            if(!token){
                return ResponseUtils.handleResponse(false, "Failed to process request", null);
            }

            const authData = {
                card: paymentData.pan,
                pin: paymentData.pin,
                expireDate: `${paymentData.expireYear}${paymentData.expireMonth}`,
                cvv2: paymentData.cvv2,
                publicKeyModulus: process.env.PUBLIC_KEY_MODULUS, //
                publicKeyExponent: process.env.PUBLIC_KEY_EXPONENT
            }
            const encryptedAuthData = generateAuthData(authData)

            const header = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }

            const reqData = {
                customerId: paymentData.email,
                amount: paymentData.amount,
                currency: 'NGN',
                authData:encryptedAuthData,
                transactionRef: paymentData.reference,
            }

            const response = await axios.post(this.baseUrl, reqData, {headers:header})

            if (response.status >= 200 && response.status<300) {

                const respData: ICardMakePaymentResp = response.data

                const data :IPaymentInitializeServiceResp<InitializeCardPaymentReq,ICardMakePaymentResp> = {
                    reference: paymentData.reference,
                    gateway_reference: respData.paymentId,
                    message: respData.plainTextSupportMessage ?? respData.message,
                    next_action: respData.responseCode === '00' ? 'confirm_status' : 'otp',
                    reqBody: reqData,
                    respData: respData
                }

                return ResponseUtils.handleResponse(true, "Payment generated successfully", data);
            }
        } catch (e: any) {
            LoggerUtils.error(e.response.data.errors)
            return ResponseUtils.handleResponse(false, e.response.data.errors, null);
        }
        return ResponseUtils.handleResponse(false, "Failed to process request", null);
    }

    /**
     * @description Handle authentication requirements(T0,S0)
     */
    otpVerification = async (reference:string,paymentId:string,otp:string):Promise<IResponse<IPaymentServiceResp<IAuthenticateOtpReq,IAuthenticateOtpResp>|null>> => {
        try{
            const url = `${this.baseUrl}/otps/auths`
            const postData = {
                paymentId,
                otp,
                transactionId:reference,
                // eciFlag :''
            }
            const token = await this.generateTokenService()

            if(!token){
                ResponseUtils.handleResponse(false, "Failed to process request", null);
            }

            const header = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }

            const response = await  axios.post(url,postData,{headers:header})

            if (response.status >= 200 && response.status<300) {
                const verifyRespData:IAuthenticateOtpResp = response.data

                const respData : IPaymentServiceResp<any, IAuthenticateOtpResp> = {
                    reqBody: postData,
                    respData: verifyRespData,
                    message: verifyRespData.message,
                    next_action: "confirm_transaction",
                    reference,
                    gateway_reference:paymentId
                }

                return ResponseUtils.handleResponse(true, "OTP verified successfully",respData );
            }

        }
        catch (e:any) {
            LoggerUtils.error(e.response.data.errors)
        }
        return ResponseUtils.handleResponse(false, "Failed to process request", null);
    }

    /**
     * @description Confirm the status of the transaction
     * @param reference
     * @param amount
     */
    confirmTransactionStatus = async (reference:string,amount:string) => {
        try{
            const token = await this.generateTokenService()
            if(!token){
                return ResponseUtils.handleResponse(false, "Failed to process request", null);
            }

            const url = `${this.confirm_status_url}?merchantcode=${this.merchantCode}&transactionReference=${reference}&amount=${amount}`
            const headers = {
                Accept: 'application/json',
                'Content-type':'application/json',
                Authorization : `Bearer ${token}`
            }
            const verifyTransResp = await axios.get(url,{headers})
        }
        catch (e) {
            LoggerUtils.error(e)
        }
    }
}

//Resend OTP