import {LoggerUtils} from "../../logger.utils";
import axios from "axios";
import * as path from 'path';
import {ICardMakePaymentResp} from "../interswitch.interface";
import {IPaymentInitializeData} from "../../../payment/payment.interface";

const generateAuthData = require(
    path.resolve(__dirname, '../../../../authData.js'),
);

export class InterSwitchCardService {

    private tokenUrl = 'https://apps.qa.interswitchng.com/passport/oauth/token';
    private baseUrl = 'https://qa.interswitchng.com/api/v3/purchases';
    private confirm_status_url = 'https://qa.interswitchng.com/collections/api/v1/gettransaction';
    private readonly clientId: string = ''
    private readonly clientSecret: string = ''

    constructor() {
        this.clientId = process.env.ISW_CLIENT_ID as string
        this.clientSecret = process.env.ISW_CLIENT_SECRET as string
    }

    generateTokenService = async () => {
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
    initializeService = async (paymentData:IPaymentInitializeData) => {
        try {
            const token = await this.generateTokenService()

            const authData = generateAuthData(
                paymentData.pan,
                paymentData.pin,
                `${paymentData.expireYear}${paymentData.expireMonth}`,
                paymentData.cvv2,
                process.env.PUBLIC_KEY_MODULUS,
                process.env.PUBLIC_KEY_EXPONENT
            )

            const header = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }

            const reqData = {
                customerId: paymentData.email,
                amount:paymentData.amount,
                currency: 'NGN',
                authData,
                transactionRef: paymentData.reference,
            }

            const response = await axios.post(this.baseUrl, reqData, {headers: header})

            if(response.status===200){
                const respData:ICardMakePaymentResp = response.data
            }

        } catch (e:any) {
            console.log(e.response.data)
            // LoggerUtils.error(e)
        }
    }
}


//generate token
//1- Make a purchase request
//2- Handle authentication requirements(T0,S0)
//3- Confirm the status of the transaction
//Resend OTP